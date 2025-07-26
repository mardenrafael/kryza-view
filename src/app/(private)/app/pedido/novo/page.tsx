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
import { useState } from "react";
import { useNovoPedidoForm } from "./hooks/use-novo-pedido-form";

export default function PedidoNovoPage() {
  const { control, form, isLoading, onSubmit } = useNovoPedidoForm();
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const handleSubmit = async (data: any) => {
    console.log("📝 Dados do formulário:", data);
    console.log("🖼️ Imagens carregadas:", uploadedImages);
    
    // Validação específica para propertyTypeId
    if (!data.propertyTypeId) {
      console.error("❌ propertyTypeId está vazio ou undefined!");
    } else {
      console.log("✅ propertyTypeId tem valor:", data.propertyTypeId);
    }
    
    // Validação para outros campos importantes
    const requiredFields = [
      'orderName', 'addressStreet', 'addressNeighborhood', 
      'addressNumber', 'addressCity', 'addressState', 
      'addressZipCode', 'propertyTypeId', 'totalArea', 'price', 'description'
    ];
    
    requiredFields.forEach(field => {
      if (!data[field]) {
        console.error(`❌ Campo obrigatório '${field}' está vazio!`);
      } else {
        console.log(`✅ Campo '${field}' tem valor:`, data[field]);
      }
    });
    
    console.log("📦 Dados finais enviados para API:", data);
    console.log("📊 Quantidade de imagens:", uploadedImages.length);
    
    // Chama o onSubmit original passando as imagens como segundo parâmetro
    await onSubmit(data, uploadedImages);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <section className="mb-4">
        <h1 className="text-2xl font-bold">Novo Pedido de Análise</h1>
        <p>Preencha os detalhes do imóvel e clique em "Salvar" para criar o pedido.</p>
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
                <ImageUpload
                  onImagesUploaded={setUploadedImages}
                  maxFiles={10}
                />
              </section>
            </>
            <Button
              className="col-span-2"
              label="Salvar"
              isLoading={isLoading}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
