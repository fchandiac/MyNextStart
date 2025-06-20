"use server";

import { CreateDiscountPercentDto, UpdateDiscountPercentDto } from "@/types/discount-percent";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// 🔍 Obtener todos
export async function getAllDiscountPercents(): Promise<any[]> {
  const res = await fetch(`${backendUrl}/discounts-percent`);
  return res.json();
}

// 🔍 Obtener por código
export async function getDiscountPercentsByCode(code: number): Promise<any[]> {
  const res = await fetch(`${backendUrl}/discounts-percent/code/${code}`);
  return res.json();
}

// 🔍 Obtener por ID
export async function getDiscountPercentById(id: number): Promise<any> {
  const res = await fetch(`${backendUrl}/discounts-percent/${id}`);
  return res.json();
}

// ➕ Crear
export async function createDiscountPercent(data: CreateDiscountPercentDto): Promise<any> {
  try {
    const res = await fetch(`${backendUrl}/discounts-percent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        error: true,
        message: result.message || "Error al crear rango",
      };
    }

    return result;
  } catch (err) {
    return { error: true, message: "Error de red o del servidor" };
  }
}

// ✏️ Actualizar
export async function updateDiscountPercent(id: number, data: UpdateDiscountPercentDto): Promise<any> {
  try {
    const res = await fetch(`${backendUrl}/discounts-percent/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        error: true,
        message: result.message || "Error al actualizar rango",
      };
    }

    return result;
  } catch (err) {
    return { error: true, message: "Error de red o del servidor" };
  }
}


// 🗑️ Eliminar
export async function deleteDiscountPercent(id: number): Promise<void> {
  await fetch(`${backendUrl}/discounts-percent/${id}`, {
    method: "DELETE",
  });
}
