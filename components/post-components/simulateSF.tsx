export interface IEntity {

}

export interface IUpgrade {
    stableWaitDuration: number;
    currentUpgradeDomain: number;
    isUpgrading: boolean;
    targetVersion: string;
}

export class ClusterManager {
    currentUpgrade: IUpgrade = {
        stableWaitDuration: 2, //"base line" upgrade - find a better way to handle initialization; maybe do a "fake" first upgrade
        currentUpgradeDomain: 0,
        isUpgrading: false,
        targetVersion: "0"
    }

    constructor(private cluster: ServiceFabricCluster) {

    }

    public startUpgrade(targetVersion: string) {
        this.currentUpgrade = {
            stableWaitDuration: 3, //todo set correctly
            currentUpgradeDomain: 0,
            isUpgrading: true,
            targetVersion
        }
        console.log(this.currentUpgrade.targetVersion)
    }

    public isUpgrading() {
        return this.currentUpgrade.isUpgrading;
    }

    update() {
        if(this.currentUpgrade.isUpgrading) {
            const currentUpgradeDomain = this.cluster.nodes[this.currentUpgrade.currentUpgradeDomain];
            if(currentUpgradeDomain.version !== this.currentUpgrade.targetVersion) {
                if(currentUpgradeDomain.state === "Up") {
                    currentUpgradeDomain.requestRestart(2);
                }else if(currentUpgradeDomain.state === "Deactivated") {
                    currentUpgradeDomain.version = this.currentUpgrade.targetVersion;
                }
            }else{
                if(this.currentUpgrade.currentUpgradeDomain === this.cluster.nodes.length) {
                    this.currentUpgrade.isUpgrading = false;
                }else{
                    this.currentUpgrade.currentUpgradeDomain += 1
                }
            }
        }
    }
}

export class Node {
    up: boolean = true;
    state: "Deactivated" | "Deactivating" | "Up" | "Down" | "Enabling" = "Up";
    version: string = "1";
    restartInfo = {
        downDuration: 0
    }

    public replicas: Replica[] = [];

    private downCounter = 0;
    constructor(public id: string) {

    }

    public requestRestart(duration: number) {
        if(this.state === "Up") {
            this.restartInfo.downDuration = duration;
            this.state = "Deactivating";
        }
        console.log(this.state)
    }

    public forceDown() {

    }

    update() {
        if(this.state === "Deactivated") {
            this.downCounter++;    
            
            if(this.downCounter === this.restartInfo.downDuration) {
                this.state = "Up";
            }
        }

        if(this.state === "Deactivating") {
            if(this.replicas.length === 0) {
                this.state = "Deactivated";
            }else{
                this.replicas[0].toBeMarkedDown = true;
            }
         }
    }
}

export class Application {
    public services: Service[] = [];

}

export interface IReplicaConfiguration {
    startUpTimeInTicks: number; //used to simulate how long it takes for a replica to come up/replicate
}

export interface IServiceConfiguration {
    stateful: boolean;
    replicaMin: number;
    replicaTarget: number;
    replicaConfig: IReplicaConfiguration;
}

export class Service {
    public partition: Partition;
    constructor(public name: string,
                public config: IServiceConfiguration) {
        this.partition = new Partition(`${name}-partition`, this);
    }
}

export class Partition {
    public replicas: Replica[] = [];
    public replicasIds = 0;
    constructor(public name: string,
                public parent: Service) {

    }

    public replicasMarkedDown() {
        return this.replicas.filter(replica => replica.toBeMarkedDown);
    }

    public createReplicaOnNode(node: Node) {
        const replica = new Replica(`${this.parent.name}-${this.replicas.length}`, node, this);
        this.replicas.push(replica);
        node.replicas.push(replica);
    }

}

export class Replica {
    public toBeMarkedDown: boolean = false; //when true will be picked up by PLB to be placed elsewhere.
    constructor(public name: string,
                public node: Node,
                public parent: Partition
                )  {
        
    }

    public destroy() {
        this.node.replicas = this.node.replicas.filter(replica => replica !== this);
        this.parent.replicas = this.parent.replicas.filter(replica => replica !== this);
    }
}

export interface IConfig {
    balancing : {
        onNodeCountChange: boolean
    }
}

export class ServiceFabricCluster {
    nodes: Node[] = [];
    applications: Application[] = [];

    private clusterManager: ClusterManager;

    constructor(nodeCount: Number) {
        for(let i = 0; i < nodeCount; i++) {
            this.nodes.push(new Node(i.toString()));
        }
        this.clusterManager = new ClusterManager(this);
    }
    public tick() {
        this.rebalance();
        this.nodes.forEach(node => node.update());
        this.clusterManager.update();
    }

    public setNodeCount(count: number) {
        if(count > this.nodes.length) {
            while(count > this.nodes.length) {
                this.nodes.push(new Node(this.nodes.length.toString()));
            }
        }else if(count < this.nodes.length){
            while(count > this.nodes.length) {
                //remove the current deactivated and deactivate another;
                const removingNode = this.nodes[this.nodes.length - 1];
                if(removingNode.state === "Deactivated") {
                    this.nodes.pop();
                }
            }
        }
    }

    public deployApplication(application: Application) {
        this.applications.push(application);
        // this.rebalance();
    }

    private getNextNodeForReplicaPlacement(partition: Partition) {

        return this.nodes.filter(node => node.up && node.state === "Up" &&
                                 partition.replicas.every(replica => replica.node !== node))
                         .sort((a,b) => a.replicas.length - b.replicas.length)[0];
    }

    //move into a PLB class
    public rebalance() {
        const services = this.applications.reduce<Service[]>((list, app) => list.concat(app.services), []);

        services.forEach(service => {
            const partition = service.partition;

            const replicasMarkedDownCount = service.partition.replicasMarkedDown().length;
            let targetCount = 0;
            if(service.config.replicaTarget === -1) {
                targetCount = this.nodes.filter(node => node.state === "Up").length;
            }else{
                targetCount = replicasMarkedDownCount + service.config.replicaMin;
            }

            let node: Node | null = this.getNextNodeForReplicaPlacement(partition);
            console.log("state", partition.replicas.length, targetCount)
            if(partition.replicas.length < targetCount) {
                if(node) {
                    partition.createReplicaOnNode(node);
                    node = null;
                }else{
                    console.log("no nodes for " + service);
                }
            } else if(replicasMarkedDownCount > 0) {
                service.partition.replicasMarkedDown()[0].destroy();
            }else if (partition.replicas.length < service.config.replicaTarget && node) {
                partition.createReplicaOnNode(node);
            }
        })
    }

    public restartNode(nodeName: string, downDurationInTicks: number, forceDown = false) {
        const node = this.nodes.find(node => node.id == nodeName);
        if(node) {
            node.requestRestart(downDurationInTicks);
        }
    }

    public upgradeCluster(targetVersion: string) {
        console.log(this.clusterManager.isUpgrading())
        if(!this.clusterManager.isUpgrading()) {
            console.log("start upgrade")
            this.clusterManager.startUpgrade(targetVersion);
        }
    }
}


console.log("starting")
const cluster = new ServiceFabricCluster(5);

const application = new Application();
application.services.push(new Service(
    "service-1",
    {
        stateful: true,
        replicaTarget: 5,
        replicaMin: 3,
        replicaConfig: {
            startUpTimeInTicks: 5
        }
    }))

cluster.deployApplication(application);
// cluster.restartNode(cluster.nodes[0].id, 5);

cluster.tick();
cluster.tick();
cluster.tick();
cluster.tick();
cluster.tick();
cluster.tick();

cluster.upgradeCluster("2");
cluster.tick();
cluster.tick();
cluster.tick();
cluster.tick();

cluster.tick();
cluster.tick();
// cluster.tick();
// cluster.tick();
// cluster.tick();
console.log(cluster)
// console.log(cluster['clusterManager'])