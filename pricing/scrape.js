const cheerio = require('cheerio');
const axios = require('axios');
const { readFile, writeFile } = require('fs/promises');

setInterval(() => {
    f();
}, 1000 * 60 * 15)

let f = () => {
    axios.get('https://www.levaonmarket.com/availableunits.aspx?myOlePropertyId=891843&floorPlans=2564683').then(async res => {
        const $ = cheerio.load(res.data);
        const rent1 = $('[data-selenium-id="Rent1"]').text();
        const rent2 = $('[data-selenium-id="Rent2"]').text();
        const rent3 = $('[data-selenium-id="Rent3"]').text();

        const data = { rent1, rent2, rent3 };
        const parsed = JSON.parse(await readFile("./data.json"));
        console.log("requesting new data" + new Date());
        if (parsed.rent1 !== rent1 || parsed.rent2 !== rent2 || parsed.rent3 !== rent3) {
            console.log("new price change" + new Date())
            try {
                await writeFile(`${new Date()}.json`.replace(/:/g, "-"), JSON.stringify(data));
            } catch (e) {
                console.log(e)
            }
            await writeFile(`data.json`, JSON.stringify(data));
        }

    })
}

f();