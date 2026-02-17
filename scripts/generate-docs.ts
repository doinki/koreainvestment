import fs from 'node:fs/promises';
import path from 'node:path';

import * as prettier from 'prettier';

import { generateJson, Service } from './generate-json';
import { normalize, sanitize } from './helpers';

const DOCUMENTATION_DIRECTORY = path.join(import.meta.dirname, '..', 'docs');

const DATA_TYPE_MAP = {
  A0001: 'String',
  A0002: 'Array',
  A0003: 'Object',
  A0004: 'Number',
  A0005: 'Object Array',
} satisfies Record<Service['apiPropertys'][number]['propertyType'], string>;

try {
  const services = await generateJson();

  await Promise.all(
    services.map((service) =>
      fs
        .mkdir(path.join(DOCUMENTATION_DIRECTORY, normalize(service['@metadata'].serviceGroup.name)), {
          recursive: true,
        })
        .then(() => generateMarkdownContent(service))
        .then((content) => prettier.format(content, { parser: 'markdown' }))
        .then((content) =>
          fs.writeFile(
            path.join(
              DOCUMENTATION_DIRECTORY,
              normalize(service['@metadata'].serviceGroup.name),
              normalize(service['@metadata'].service.name) + '.md',
            ),
            content,
            { encoding: 'utf8' },
          ),
        ),
    ),
  );
} catch (error) {
  console.error(error);
  process.exit(1);
}

async function generateMarkdownContent(data: Service): Promise<string> {
  const requestHeaders = data.apiPropertys.filter((p) => p.bodyType === 'req_h');
  const requestBody = data.apiPropertys.filter((p) => p.bodyType === 'req_b');
  const responseHeaders = data.apiPropertys.filter((p) => p.bodyType === 'res_h');
  const responseBody = data.apiPropertys.filter((p) => p.bodyType === 'res_b');

  return `
# [${data.name}](https://apiportal.koreainvestment.com/apiservice-apiservice?${data.accessUrl})

- Type: ${data.apiType}
- Method: ${data.httpMethod}
- URL: ${data.accessUrl}
- 실전 DOMAIN: ${data.realDomain}
- 모의 DOMAIN: ${data.virtualDomain}
- 실전 TR ID: ${data.realTrId ?? ''}
- 모의 TR ID: ${data.virtualTrId ?? ''}

## 개요
${data.apiSummary}

## 요청
### Header
${generateMarkdownTable(requestHeaders)}

### Body
${generateMarkdownTable(requestBody)}

## 응답
### Header
${generateMarkdownTable(responseHeaders)}

### Body
${generateMarkdownTable(responseBody)}
`.trim();
}

function generateMarkdownTable(properties: Service['apiPropertys']): string {
  if (properties.length === 0) return '';

  const header = `| Element | 한글명 | Type | Required | Length | Description |\n| --- | --- | --- | --- | --- | --- |`;

  const propertyCdMap = new Map(properties.map((p) => [p.propertyOrder, p.propertyCd]));

  const rows = properties.map((prop) => {
    let displayCd = prop.propertyCd;
    if (prop.propertyOrder.includes('.')) {
      const parentOrder = prop.propertyOrder.split('.').slice(0, -1).join('.');
      const parentCd = propertyCdMap.get(parentOrder);
      if (parentCd) {
        displayCd = `${parentCd}.${prop.propertyCd}`;
      }
    }

    return `| ${sanitize(displayCd)} | ${sanitize(prop.propertyNm)} | ${
      DATA_TYPE_MAP[prop.propertyType] ?? prop.propertyType
    } | ${sanitize(prop.requireYn)} | ${sanitize(prop.propertyLength)} | ${sanitize(prop.description)} |`;
  });

  return [header, ...rows].join('\n');
}
