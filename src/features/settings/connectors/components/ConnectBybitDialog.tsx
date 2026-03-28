import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useConnectBybit } from "../hooks";
import { Loader2, Plus } from "lucide-react";

const bybitSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  apiKey: z.string().min(10, "API Key inválida"),
  apiSecret: z.string().min(10, "API Secret inválida"),
  isTestnet: z.boolean().default(false),
});

type BybitFormData = z.infer<typeof bybitSchema>;

export function ConnectBybitDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: connectBybit, isPending } = useConnectBybit();

  const form = useForm<BybitFormData>({
    resolver: zodResolver(bybitSchema),
    defaultValues: {
      name: "Mi cuenta Bybit",
      apiKey: "",
      apiSecret: "",
      isTestnet: false,
    },
  });

  const onSubmit = (data: BybitFormData) => {
    connectBybit(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Conectar Bybit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Conectar cuenta Bybit</DialogTitle>
          <DialogDescription>
            Ingresa tus credenciales de API de Bybit para conectar tu cuenta.
            Solo necesitas permisos de <strong>lectura</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Mi cuenta Bybit" {...field} />
                  </FormControl>
                  <FormDescription>
                    Un nombre descriptivo para identificar esta conexión
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tu API Key de Bybit"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Secret</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tu API Secret de Bybit"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTestnet"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Testnet</FormLabel>
                    <FormDescription>
                      Usa la red de pruebas de Bybit (para desarrollo)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Conectar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
