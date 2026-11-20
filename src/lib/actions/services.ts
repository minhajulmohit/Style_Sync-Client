"use server";

import { authenticatedFetch } from "@/lib/actions/authenticated-fetch";
import type { AddServicePayload, ServiceRecord } from "@/types/services";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getAdminServices = async (): Promise<ServiceRecord[]> => {
  const response = await authenticatedFetch(`${baseUrl}/admin/services`);

  if (!response.ok) {
    throw new Error(`Could not load admin services (HTTP ${response.status}).`);
  }

  return response.json();
};

export const addService = async (service: AddServicePayload) => {
  const response = await authenticatedFetch(`${baseUrl}/add-service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  });

  if (!response.ok) {
    throw new Error(`Could not add service (HTTP ${response.status}).`);
  }
};

export const deleteService = async (serviceId: string): Promise<void> => {
  const response = await authenticatedFetch(`${baseUrl}/services/${serviceId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Could not delete service (HTTP ${response.status}).`);
  }
};

export const updateService = async (
  serviceId: string,
  serviceData: AddServicePayload,
): Promise<void> => {
  const res = await authenticatedFetch(`${baseUrl}/services/${serviceId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(
      message || `Could not update service (HTTP ${res.status}).`,
    );
  }
};
