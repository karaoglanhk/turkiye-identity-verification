const https = require('https');

const post = (props) => {
    return new Promise((resolve, reject) => {
        const { options, body } = props;

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });
        });

        if (body) {
            req.write(body);
        }

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
};

/**
 * @param {string} identityNo - etc. 11111111111
 * @param {string} name - etc. Hüseyin
 * @param {string} surname - etc. Karaoğlan
 * @param {string} birthYear - etc. 2000
 * @returns {boolean}
 */
const nativeCitizenVerify = async (identityNo, name, surname, birthYear) => {
    try {

        const body = `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <TCKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/WS">
        <TCKimlikNo>${identityNo}</TCKimlikNo>
        <Ad>${name}</Ad>
        <Soyad>${surname}</Soyad>
        <DogumYili>${birthYear}</DogumYili>
        </TCKimlikNoDogrula>
    </soap12:Body>
    </soap12:Envelope>`;

        const request = await post({
            body,
            options: {
                port: 443,
                method: 'POST',
                path: '/Service/KPSPublic.asmx',
                hostname: 'tckimlik.nvi.gov.tr',
                headers: { 'Content-Type': 'application/soap+xml' },
            },
        });

        const searchPattern = /<TCKimlikNoDogrulaResult>(.*?)<\/TCKimlikNoDogrulaResult>/;
        const foundPart = request.match(searchPattern);

        return foundPart && foundPart[1] === 'true';
    } catch (err) {
        throw err;
    }
};

/**
 * @param {string} identityNo - etc. 99111111111
 * @param {string} name - etc. Hüseyin
 * @param {string} surname - etc. Karaoğlan
 * @param {string} birthDate - etc. 10
 * @param {string} birthMonth - etc. 8
 * @param {string} birthYear - etc. 2000
 * @returns {boolean}
 */
const foreignCitizenVerify = async (identityNo, name, surname, birthDate, birthMonth, birthYear) => {
    try {

        const body = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
      <soap:Body>
        <YabanciKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/WS">
          <KimlikNo>${identityNo}</KimlikNo>
          <Ad>${name}</Ad>
          <Soyad>${surname}</Soyad>
          <DogumGun>${birthDate}</DogumGun>
          <DogumAy>${birthMonth}</DogumAy>
          <DogumYil>${birthYear}</DogumYil>
        </YabanciKimlikNoDogrula>
      </soap:Body>
    </soap:Envelope>`;

        const request = await post({
            body,
            options: {
                port: 443,
                method: 'POST',
                path: '/Service/KPSPublicYabanciDogrula.asmx',
                hostname: 'tckimlik.nvi.gov.tr',
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'SOAPAction': 'http://tckimlik.nvi.gov.tr/WS/YabanciKimlikNoDogrula',
                },
            },
        });

        const searchPattern = /<YabanciKimlikNoDogrulaResult>(.*?)<\/YabanciKimlikNoDogrulaResult>/;
        const foundPart = request.match(searchPattern);

        return foundPart && foundPart[1] === 'true';
    } catch (err) {
        throw err;
    }
};

module.exports = {
    nativeCitizenVerify,
    foreignCitizenVerify
}