import '@mantine/core/styles.css';
import { Container, MantineProvider, Title } from '@mantine/core';
import { Form } from './Form';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Container id='container' maw={400}>
        <Title mt={'sm'} order={2}>
          必要加湿量計算フォーム
        </Title>
        <Title order={6} mb={'sm'} c={'dimmed'}>
          部屋に必要な加湿器のスペックを算出します。
        </Title>
        <Form />
      </Container>
    </MantineProvider>
  );
}
