import { Alert, Box, Button, Group, NumberInput, Stack, Text } from '@mantine/core';
import { createFormContext } from '@mantine/form';
import { calculateHumidifierRequirements } from './calcHumidifier';

// フォームの値の型定義
type FormValues = {
  area: number; // 平米数 (m²)
  targetHumidity: number; // 目標湿度 (%)
  roomTemperature: number; // 室温 (°C)
  continuousOperationHours: number; // 連続運転時間 (時間)
  ceilingHeight: number; // 天井高 (m)
  ventilationRate: number; // 換気回数 (回/時)
  initialHumidity: number; // 初期湿度(%)
  requiredHumidificationCapacity: number; // 必要な加湿能力 (mL/時)
  requiredTankCapacity: number; // 必要なタンク容量 (L)
};

const [FormProvider, _useFormContext, useForm] = createFormContext<FormValues>();

// フォームコンポーネント
export const Form = (): JSX.Element => {
  const form = useForm({
    initialValues: {
      area: 50, // 平米数 (m²)
      targetHumidity: 50, // 目標湿度 (%)
      roomTemperature: 20, // 室温 (°C)
      continuousOperationHours: 8, // 連続運転時間 (時間)
      ceilingHeight: 2.4, // 天井高 (m)
      ventilationRate: 0.5, // 換気回数 (回/時)
      initialHumidity: 20, // 初期湿度(%)
      requiredHumidificationCapacity: 0,
      requiredTankCapacity: 0
    },
    validate: {
      area: (value) => (value > 0 ? null : '面積は正の数で入力してください'),
      targetHumidity: (value) => (value >= 0 && value <= 100 ? null : '目標湿度は0-100%の範囲で入力してください'),
      roomTemperature: (value) => (value >= -50 && value <= 50 ? null : '室温は-50℃から50℃の範囲で入力してください'),
      continuousOperationHours: (value) => (value > 0 ? null : '連続運転時間は正の数で入力してください'),
      ceilingHeight: (value) => (value > 0 ? null : '天井高は正の数で入力してください'),
      ventilationRate: (value) => (value >= 0 ? null : '換気回数は0以上の数で入力してください'),
      initialHumidity: (value) => (value >= 0 && value <= 100 ? null : '初期湿度は0-100%の範囲で入力してください')
    }
  });

  // フォーム送信時の処理
  const handleSubmit = async (): Promise<void> => {
    form.setValues({
      requiredHumidificationCapacity: 0,
      requiredTankCapacity: 0
    });

    const result = calculateHumidifierRequirements(
      form.values.area,
      form.values.targetHumidity,
      form.values.roomTemperature,
      form.values.continuousOperationHours,
      form.values.ceilingHeight,
      form.values.ventilationRate,
      form.values.initialHumidity
    );

    form.setValues({
      requiredHumidificationCapacity: result.requiredHumidificationCapacity,
      requiredTankCapacity: result.requiredTankCapacity
    });
  };

  return (
    <FormProvider form={form}>
      <Box
        component='form'
        onSubmit={form.onSubmit(() => {
          void handleSubmit();
        })}
      >
        <Stack>
          <NumberInput label='部屋面積 (m²)' {...form.getInputProps('area')} withAsterisk />
          <NumberInput label='目標湿度 (%)' {...form.getInputProps('targetHumidity')} withAsterisk />
          <NumberInput label='室温 (°C)' {...form.getInputProps('roomTemperature')} withAsterisk />
          <NumberInput label='連続運転時間 (時間)' {...form.getInputProps('continuousOperationHours')} withAsterisk />
          {/* <NumberInput label='天井高 (m)' {...form.getInputProps('ceilingHeight')} withAsterisk /> */}
          {/* <NumberInput label='換気回数 (回/時)' {...form.getInputProps('ventilationRate')} withAsterisk /> */}
          {/* <NumberInput label='初期湿度 (%)' {...form.getInputProps('initialHumidity')} withAsterisk /> */}
          <Group justify='flex-end'>
            <Button type='submit'>計算！</Button>
          </Group>
        </Stack>
      </Box>
      {form.values.requiredHumidificationCapacity && (
        <Alert title='計算結果' color='blue' mt={'md'}>
          <Text>必要な加湿能力: {form.values.requiredHumidificationCapacity} mL/時</Text>
          <Text>必要なタンク容量: {form.values.requiredTankCapacity} L</Text>
        </Alert>
      )}
    </FormProvider>
  );
};
