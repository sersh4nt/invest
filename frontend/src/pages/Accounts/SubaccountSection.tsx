import { Card, Group, Switch, Text } from "@mantine/core";
import { useState } from "react";
import { useEditSubaccountApiV1SubaccountsSubaccountIdPut } from "../../api/accounts/accounts";
import { SubaccountScheme } from "../../models";

interface SubaccountSectionProps {
  subaccount: SubaccountScheme;
}

const SubaccountSection: React.FC<SubaccountSectionProps> = ({
  subaccount,
}) => {
  const [checked, setChecked] = useState<boolean>(
    subaccount.is_enabled ?? false
  );
  const { mutateAsync } = useEditSubaccountApiV1SubaccountsSubaccountIdPut();

  const handleCheck = async (e: any) => {
    try {
      const response = await mutateAsync({
        subaccountId: subaccount.id,
        data: { is_enabled: e.currentTarget.checked },
      });
      setChecked(response.is_enabled ?? false);
    } catch (err) {}
  };

  return (
    <Card.Section inheritPadding py="xs" withBorder>
      <Text>Subaccount №{subaccount.id}</Text>
      {subaccount.name && <Text>Name: {subaccount.name}</Text>}
      {subaccount.description && (
        <Text>Description: {subaccount.description}</Text>
      )}
      <Group position="apart">
        <Text>Enabled</Text>
        <Switch checked={checked} onChange={handleCheck} />
      </Group>
    </Card.Section>
  );
};

export default SubaccountSection;
