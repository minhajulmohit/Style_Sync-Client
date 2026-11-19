import type { AddServicePayload } from "@/types/services";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const addService = async (service: AddServicePayload) => {
  const response = await fetch(`${baseUrl}/add-service`, {
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

export const deleteService = async (serviceId: string) => {
  return fetch(`${baseUrl}/services/${serviceId}`, {
    method: "DELETE",
  });
};

export const updateService = async (
  serviceId: string,
  serviceData: AddServicePayload,
) => {
  const res = await fetch(`${baseUrl}/jobs/${serviceId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Failed to update job (${res.status})`);
  }
};
