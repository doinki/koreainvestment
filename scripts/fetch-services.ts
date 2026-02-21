import * as cheerio from 'cheerio';

import { excute, normalize, wait } from './helpers';

const KOREA_INVESTMENT_BASE_URL = 'https://apiportal.koreainvestment.com';
const API_SUMMARY_ENDPOINT = new URL('/apiservice-summary', KOREA_INVESTMENT_BASE_URL);
const API_DETAIL_ENDPOINT = new URL('/api/apis/public/detail', KOREA_INVESTMENT_BASE_URL);

const MAX_CONCURRENT_REQUESTS = 5;

export async function fetchServices(): Promise<Service[]> {
  try {
    const serviceGroups = await fetchServiceGroups();

    const tasks: { service: ServiceMetadata; serviceGroup: Omit<ServiceGroupMetadata, 'serviceMetadatas'> }[] = [];
    for (const serviceGroup of serviceGroups) {
      for (const serviceItem of serviceGroup.serviceMetadatas) {
        tasks.push({ service: serviceItem, serviceGroup: { id: serviceGroup.id, name: serviceGroup.name } });
      }
    }

    return await excute(MAX_CONCURRENT_REQUESTS, tasks, (task) => generateService(task.service, task.serviceGroup));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
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

    const serviceGroupId = $serviceGroup.attr('id')!.trim();
    const serviceGroupName = $serviceGroupAnchor.text().trim();

    const services: ServiceMetadata[] = [];
    $serviceGroup.find('.snb-menu-list li').each((_, service) => {
      const $service = $(service);

      const serviceId = $service.attr('id')!.trim();
      const serviceName = normalize($service.text());
      const servicePath = $service.find('a').attr('onclick')!.trim().slice(15, -2);

      services.push({ id: serviceId, name: serviceName, path: servicePath });
    });

    serviceGroups.push({
      id: serviceGroupId,
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

async function generateService(
  service: ServiceMetadata,
  serviceGroup: Omit<ServiceGroupMetadata, 'serviceMetadatas'>,
): Promise<Service> {
  const data = await fetchService(service.path);

  await wait(50);

  return {
    '@metadata': {
      serviceGroup: {
        id: serviceGroup.id,
        name: serviceGroup.name,
      },
      service,
    },
    ...data,
  };
}

interface ServiceGroupMetadata {
  id: string;
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

export interface Service extends ServiceResponse {
  '@metadata': {
    serviceGroup: Omit<ServiceGroupMetadata, 'serviceMetadatas'>;
    service: ServiceMetadata;
  };
}
