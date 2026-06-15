import ContractPreview from "@/components/ContractPreview";
import { calculateContractValues } from "@/lib/calculations";
import { getTemplateDefaults } from "@/lib/templates";
import { SIJABLOON_2_SLUG } from "@/lib/templateConstants";

export default function Sjabloon2VoorbeeldPage() {
  const data = getTemplateDefaults(SIJABLOON_2_SLUG);
  const calculations = calculateContractValues(data);

  return (
    <main>
      <ContractPreview data={data} calculations={calculations} />
    </main>
  );
}
