"use client";

import { Button } from "@/components/button";
import {
  NumberField,
  Select,
  TextAreaField,
  TextField,
} from "@/components/fields";
import { Form } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { PropertyType } from "@/dd";
import { api } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEditarPedidoForm } from "../hooks/use-editar-pedido-form";

interface OrderDetail {
  id: string;
  code: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: {
    id: number;
    name: string;
  };
  property: {
    description: string;
    addressStreet: string;
    addressNumber: string;
    addressComplement?: string;
    addressCity: string;
    addressState: string;
    addressZipCode: string;
    addressNeighborhood: string;
    totalArea: number;
    constructionYear?: number;
    price: number;
    propertyType: {
      id: number;
      name: string;
    };
    propertyImage: {
      image: {
        id: string;
        url: string;
        description: string;
      };
    }[];
  };
}

export default function EditarPedidoPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const { control, form, isLoading, onSubmit } = useEditarPedidoForm(params.id as string);

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(params.id as string);
    }
  }, [params.id]);

  const fetchOrderDetails = async (orderId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/pedido/${orderId}`);
      const orderData = response.data;
      
      // Verifica se o pedido pode ser editado (apenas pendentes)
      if (orderData.status.name !== "PENDING") {
        toast.error("Este pedido não pode ser editado. Apenas pedidos pendentes podem ser alterados.");
        router.push(`/app/pedido/${orderId}`);
        return;
      }

      setOrder(orderData);
      
      // Preenche o formulário com os dados existentes
      form.reset({
        orderName: orderData.name,
        addressStreet: orderData.property.addressStreet,
        addressNeighborhood: orderData.property.addressNeighborhood,
        addressNumber: orderData.property.addressNumber,
        addressComplement: orderData.property.addressComplement || "",
        addressCity: orderData.property.addressCity,
        addressState: orderData.property.addressState,
        addressZipCode: orderData.property.addressZipCode,
        propertyTypeId: orderData.property.propertyType.id.toString(),
        totalArea: orderData.property.totalArea.toString(),
        constructionYear: orderData.property.constructionYear?.toString() || "",
        price: orderData.property.price.toString(),
        description: orderData.property.description,
      });

      // Converte imagens existentes para o formato esperado
      const existingImagesFormatted = orderData.property.propertyImage.map((pi: any) => ({
        url: pi.image.url,
        originalName: pi.image.description || "Imagem",
        id: pi.image.id,
      }));
      setExistingImages(existingImagesFormatted);
      
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido:", error);
      toast.error("Erro ao carregar detalhes do pedido");
      router.push("/app/pedido");
    }
    setLoading(false);
  };

  const handleSubmit = async (data: any) => {
    // Combina imagens existentes com novas imagens
    const allImages = [...existingImages, ...uploadedImages];
    
    const dataWithImages = {
      ...data,
      images: allImages,
    };
    
    await onSubmit(dataWithImages);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando dados do pedido...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Pedido não encontrado.</p>
          <Link href="/app/pedido">
            <Button 
              label="Voltar para Meus Pedidos"
              isLoading={false}
              className="mt-4"
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <section className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/app/pedido/${order.id}`}>
            <Button 
              label="Voltar"
              isLoading={false}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Editar Pedido #{order.code}</h1>
            <p className="text-muted-foreground">
              Altere as informações do pedido. Apenas pedidos pendentes podem ser editados.
            </p>
          </div>
        </div>
      </section>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <>
              <h2 className="text-lg font-bold col-span-2">Informações Gerais</h2>
              <section className="col-span-2 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <TextField
                    label="Título do Pedido"
                    control={control}
                    name="orderName"
                    placeholder="Dê um título para facilitar a identificação"
                    required
                  />
                </div>
              </section>
            </>
            <>
              <h2 className="text-lg font-bold col-span-2">Endereço do Imóvel</h2>
              <section className="col-span-2 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <TextField
                    label="Rua"
                    control={control}
                    name="addressStreet"
                    placeholder="Nome da rua"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <TextField
                    label="Bairro"
                    control={control}
                    name="addressNeighborhood"
                    placeholder="Nome do bairro"
                    required
                  />
                </div>
                <TextField
                  label="Número"
                  control={control}
                  name="addressNumber"
                  placeholder="Número"
                  required
                />
                <TextField
                  label="Complemento"
                  control={control}
                  name="addressComplement"
                  placeholder="Complemento"
                />
                <TextField
                  label="Cidade"
                  control={control}
                  name="addressCity"
                  placeholder="Cidade"
                  required
                />
                <TextField
                  label="Estado"
                  control={control}
                  name="addressState"
                  placeholder="Estado"
                  required
                />
                <TextField
                  label="CEP"
                  control={control}
                  name="addressZipCode"
                  placeholder="CEP"
                  required
                />
              </section>
            </>
            <>
              <h2 className="text-lg font-bold col-span-2">Detalhes do Imóvel</h2>
              <section className="col-span-2 grid grid-cols-2 gap-4">
                <Select.Root
                  label="Tipo do Imóvel"
                  control={control}
                  name="propertyTypeId"
                  placeholder="Selecione o tipo do imóvel"
                  required
                >
                  <Select.Items>
                    {PropertyType.map(({ id, name }) => (
                      <Select.Item key={id} value={""+id} label={name} />
                    ))}
                  </Select.Items>
                </Select.Root>
                <NumberField
                  label="Área do Imóvel (m²)"
                  control={control}
                  name="totalArea"
                  placeholder="Área do imóvel"
                  required
                />
                <TextField
                  label="Ano de Construção"
                  control={control}
                  name="constructionYear"
                  placeholder="Ano de construção"
                />
                <NumberField
                  label="Valor do Imóvel"
                  control={control}
                  name="price"
                  placeholder="Valor"
                  required
                />
                <div className="col-span-2">
                  <TextAreaField
                    label="Descrição do Imóvel"
                    control={control}
                    name="description"
                    placeholder="Descreva o imóvel..."
                    required
                  />
                </div>
              </section>
            </>
            <>
              <h2 className="text-lg font-bold col-span-2">Imagens do Imóvel</h2>
              <section className="col-span-2">
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Imagens atuais ({existingImages.length})</p>
                    <div className="grid grid-cols-3 gap-2">
                      {existingImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img.url}
                            alt={img.originalName}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setExistingImages(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <ImageUpload
                  onImagesUploaded={setUploadedImages}
                  maxFiles={10}
                />
              </section>
            </>
            <Button
              className="col-span-2"
              label="Salvar Alterações"
              isLoading={isLoading}
            />
          </div>
        </form>
      </Form>
    </div>
  );
} 