import { Plus } from "lucide-react";
import { BaseConnectorDefinitionForm, type ConnectorDefinitionFormData } from "./BaseConnectorDefinitionForm";

interface AddConnectorDefinitionFormProps {
	onSubmit: (data: ConnectorDefinitionFormData) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const AddConnectorDefinitionForm = ({
	onSubmit,
	onCancel,
	isLoading = false,
}: AddConnectorDefinitionFormProps) => {
	return (
		<BaseConnectorDefinitionForm
			mode="create"
			onSubmit={onSubmit}
			onCancel={onCancel}
			isLoading={isLoading}
			title="Agregar Definición de Conector"
			description="Crea una nueva definición de conector que estará disponible para los tenants de la plataforma."
			submitButtonText="Crear Conector"
			submitButtonIcon={Plus}
		/>
	);
};
