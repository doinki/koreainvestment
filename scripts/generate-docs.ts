import fs from 'node:fs';
import path from 'node:path';

import * as cheerio from 'cheerio';
import * as prettier from 'prettier';

const DOCUMENTATION_DIRECTORY = path.join(import.meta.dirname, '..', 'docs');

const KOREA_INVESTMENT_BASE_URL = 'https://apiportal.koreainvestment.com';
const API_SUMMARY_ENDPOINT = new URL('/apiservice-summary', KOREA_INVESTMENT_BASE_URL);
const API_DETAIL_ENDPOINT = new URL('/api/apis/public/detail', KOREA_INVESTMENT_BASE_URL);

const MAX_CONCURRENT_REQUESTS = 5;
const DATA_TYPE_MAP = {
  A0001: 'String',
  A0002: 'Array',
  A0003: 'Object',
  A0004: 'Number',
  A0005: 'Object Array',
} satisfies Record<ServiceApiProperty['propertyType'], string>;

try {
  const serviceGroups = await fetchServiceGroups();

  const tasks: { serviceGroupDirectoryName: string; item: ServiceMetadata }[] = [];
  for (const serviceGroup of serviceGroups) {
    const serviceGroupDirectoryName = serviceGroup.directoryName;
    fs.mkdirSync(path.join(DOCUMENTATION_DIRECTORY, serviceGroupDirectoryName), { recursive: true });

    for (const serviceItem of serviceGroup.serviceMetadatas) {
      tasks.push({ serviceGroupDirectoryName, item: serviceItem });
    }
  }

  await excute(MAX_CONCURRENT_REQUESTS, tasks, (task) => processService(task.serviceGroupDirectoryName, task.item));
} catch (error) {
  console.error(error);
  process.exit(1);
}

async function fetchServiceGroups(): Promise<ServiceGroupMetadata[]> {
  const response = await fetch(API_SUMMARY_ENDPOINT, {
    headers: { accept: 'text/html', 'accept-encoding': 'gzip' },
  });
  if (!response.ok) {
    throw new Error([response.url, response.status, response.statusText].filter(Boolean).join(' '));
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const serviceGroups: ServiceGroupMetadata[] = [];
  $('#snb > li[id]').each((_, serviceGroup) => {
    const $serviceGroup = $(serviceGroup);
    const $serviceGroupAnchor = $serviceGroup.find('> a');

    const serviceGroupName = $serviceGroupAnchor.text().trim();
    const serviceGroupDirectoryName = normalizeFileName(serviceGroupName);

    const services: ServiceMetadata[] = [];
    $serviceGroup.find('.snb-menu-list li').each((_, service) => {
      const $service = $(service);

      const serviceId = $service.attr('id')!.trim();
      const serviceName = normalizeFileName($service.text());
      const servicePath = $service.find('a').attr('onclick')!.trim().slice(15, -2);

      services.push({ id: serviceId, name: serviceName, path: servicePath });
    });

    serviceGroups.push({
      directoryName: serviceGroupDirectoryName,
      name: serviceGroupName,
      serviceMetadatas: services,
    });
  });

  return serviceGroups;
}

async function fetchService(path: string): Promise<ServiceResponse> {
  const apiUrl = new URL(API_DETAIL_ENDPOINT);
  apiUrl.searchParams.set('accessUrl', path);

  const response = await fetch(apiUrl, {
    headers: { accept: 'application/json', 'accept-encoding': 'gzip' },
  });

  if (!response.ok) {
    throw new Error([response.url, response.status, response.statusText].filter(Boolean).join(' '));
  }

  return (await response.json()) as ServiceResponse;
}

async function processService(groupDirectoryName: string, service: ServiceMetadata) {
  const data = await fetchService(service.path);

  const markdown = await generateMarkdown(data, service.path);
  const filePath = path.join(DOCUMENTATION_DIRECTORY, groupDirectoryName, `${service.name}.md`);

  fs.writeFileSync(filePath, markdown, { encoding: 'utf8' });

  await wait(50);
}

async function generateMarkdown(data: ServiceResponse, path: string): Promise<string> {
  const requestHeaders = data.apiPropertys.filter((p) => p.bodyType === 'req_h');
  const requestBody = data.apiPropertys.filter((p) => p.bodyType === 'req_b');
  const responseHeaders = data.apiPropertys.filter((p) => p.bodyType === 'res_h');
  const responseBody = data.apiPropertys.filter((p) => p.bodyType === 'res_b');

  const content = `
# [${data.name}](https://apiportal.koreainvestment.com/apiservice-apiservice?${path})

- Type: ${data.apiType}
- Method: ${data.httpMethod}
- URL: ${data.accessUrl}
- 실전 DOMAIN: ${data.realDomain}
- 모의 DOMAIN: ${data.virtualDomain}
- 실전 TR ID: ${data.realTrId}
- 모의 TR ID: ${data.virtualTrId}

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

  return prettier.format(content, { parser: 'markdown' });
}

function generateMarkdownTable(properties: ServiceApiProperty[]): string {
  if (properties.length === 0) return '';

  const header = `| Element | 한글명 | Type | Required | Length | Description |\n| --- | --- | --- | --- | --- | --- |`;
  const rows = properties.map((prop) => {
    return `| ${sanitizeText(prop.propertyCd)} | ${sanitizeText(prop.propertyNm)} | ${
      DATA_TYPE_MAP[prop.propertyType] ?? prop.propertyType
    } | ${sanitizeText(prop.requireYn)} | ${sanitizeText(prop.propertyLength)} | ${sanitizeText(prop.description)} |`;
  });

  return [header, ...rows].join('\n');
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeFileName(name: string): string {
  return name.trim().replace(/\//g, '_');
}

function sanitizeText(text: string): string {
  return text.trim().replace(/[\r\n]+/g, ' ');
}

async function excute<T>(concurrencyLimit: number, items: T[], iteratorFn: (item: T) => Promise<void>): Promise<void> {
  const tasks: Promise<void>[] = [];
  const executingTasks: Promise<void>[] = [];

  for (const item of items) {
    const task = Promise.resolve().then(() => iteratorFn(item));
    tasks.push(task);

    if (concurrencyLimit <= items.length) {
      const executingTask: Promise<void> = task.then(() => {
        executingTasks.splice(executingTasks.indexOf(executingTask), 1);
      });
      executingTasks.push(executingTask);
      if (executingTasks.length >= concurrencyLimit) {
        await Promise.race(executingTasks);
      }
    }
  }
  await Promise.all(tasks);
}

interface ServiceGroupMetadata {
  directoryName: string;
  name: string;
  serviceMetadatas: ServiceMetadata[];
}

interface ServiceMetadata {
  id: string;
  name: string;
  path: string;
}

interface ServiceResponse {
  accessUrl: string;
  apiPropertys: ServiceApiProperty[];
  apiSummary: string;
  apiType: 'REST' | 'WEBSOCKET';
  contentType: string;
  description: string;
  httpMethod: string;
  id: string;
  name: string;
  realDomain: string;
  realTrId: string | null;
  reqFormat: 'JSON';
  virtualDomain: string;
  virtualTrId: string | null;
}

interface ServiceApiProperty {
  bodyType: 'req_h' | 'req_b' | 'res_h' | 'res_b';
  createdBy: string;
  createdDate: string;
  description: string;
  id: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  propertyCd: string;
  propertyLength: string;
  propertyNm: string;
  propertyOrder: string;
  propertyType: 'A0001' | 'A0002' | 'A0003' | 'A0004' | 'A0005';
  recordState: string;
  requireYn: 'Y' | 'N';
}
