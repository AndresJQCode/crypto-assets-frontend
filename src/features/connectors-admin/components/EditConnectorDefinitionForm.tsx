import { Save } from "lucide-react";
import type { ConnectorDefinition } from "../types";
import { BaseConnectorDefinitionForm, type ConnectorDefinitionFormData } from "./BaseConnectorDefinitionForm";

interface EditConnectorDefinitionFormProps {
	connector: ConnectorDefinition;
	onSubmit: (data: ConnectorDefinitionFormData) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const EditConnectorDefinitionForm = ({
	connector,
	onSubmit,
	onCancel,
	isLoading = false,
}: EditConnectorDefinitionFormProps) => {
	return (
		<BaseConnectorDefinitionForm
			mode="edit"
			initialData={{
				name: connector.name,
				type: connector.type,
				description: connector.description,
				isActive: connector.isActive,
			}}
			onSubmit={onSubmit}
			onCancel={onCancel}
			isLoading={isLoading}
			title="Editar Definición de Conector"
			description="Modifica la información del conector. Los cambios afectarán a todos los tenants."
			submitButtonText="Guardar Cambios"
			submitButtonIcon={Save}
		/>
	);
};
