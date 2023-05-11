import { Button, Center, Modal, SimpleGrid, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { IconPlus } from "@tabler/icons-react";
import { useQueryClient } from "react-query";
import {
  getListWorkersApiV1WorkersGetQueryKey,
  useListWorkersApiV1WorkersGet,
} from "../../api/robots/robots";
import WorkerForm from "../../components/WorkerForm";
import WorkerCard from "./WorkerCard";

const Workers: React.FC = () => {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure();
  const { data, isLoading } = useListWorkersApiV1WorkersGet();

  const handleSuccess = () => {
    close();
    queryClient.invalidateQueries(getListWorkersApiV1WorkersGetQueryKey());
  };

  return (
    <>
      <Skeleton visible={isLoading}>
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: "xl", cols: 3 },
            { maxWidth: "md", cols: 2 },
            { maxWidth: "sm", cols: 1 },
          ]}
        >
          {data && data.items.map((worker) => <WorkerCard worker={worker} />)}
        </SimpleGrid>
      </Skeleton>
      <Center my="md">
        <Button
          leftIcon={<IconPlus />}
          variant="white"
          color="teal"
          onClick={open}
        >
          Add new worker
        </Button>
      </Center>
      <Modal opened={opened} onClose={close} title="Add new worker">
        <WorkerForm onSuccess={handleSuccess} />
      </Modal>
    </>
  );
};

export default Workers;
