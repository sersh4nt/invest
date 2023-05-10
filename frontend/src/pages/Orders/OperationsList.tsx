import {
  ActionIcon,
  Button,
  Center,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import useGetOperationsInfinite from "../../hooks/useGetOperationsInfinite";
import useSubaccount from "../../hooks/useSubaccount";
import OperationFactory from "./OperationFactory";

const PAGE_SIZE: number = 50;

const OperationsList: React.FC = () => {
  const { ref, inView } = useInView();
  const { subaccount } = useSubaccount();

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useGetOperationsInfinite(
    Number(subaccount),
    { page_size: PAGE_SIZE },
    {
      query: {
        getNextPageParam: (lastPage) =>
          lastPage.page * PAGE_SIZE + lastPage.items.length < lastPage.count
            ? lastPage.page + 1
            : undefined,
      },
    }
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  const operations = useMemo(() => {
    var lastDate: string | null = null;
    var results: JSX.Element[] = [];
    if (!data?.pages) {
      return null;
    }
    for (const page of data.pages) {
      for (const operation of page.items) {
        var currentDate = new Date(operation.date).toLocaleDateString("ru-RU");
        if (!lastDate || lastDate != currentDate)
          results.push(
            <Divider
              my={0}
              variant="dashed"
              labelPosition="center"
              label={currentDate}
              key={currentDate}
            />
          );
        results.push(
          <OperationFactory operation={operation} key={operation.broker_id} />
        );
        lastDate = currentDate;
      }
    }
    return results;
  }, [data]);

  return (
    <Stack h="100%" sx={{ background: "#fff" }} spacing={0}>
      <Group position="apart" p="sm">
        <Text>Completed orders</Text>
        <ActionIcon loading={isFetching}>
          <IconRefresh onClick={() => refetch()} />
        </ActionIcon>
      </Group>
      <Divider m={0} />
      <Stack spacing="xs" style={{ flex: "1 1 0", overflowY: "auto" }}>
        {operations}
        <span>
          <Center py="xs">
            <Button
              ref={ref}
              loading={isFetchingNextPage}
              disabled={!hasNextPage}
              size="sm"
              h={33}
              sx={{ margin: "auto" }}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load more"
                : "Nothing more to load"}
            </Button>
          </Center>
        </span>
      </Stack>
    </Stack>
  );
};
export default OperationsList;
