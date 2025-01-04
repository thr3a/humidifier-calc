// 計算結果の型定義
interface CalculationResult {
  requiredHumidificationCapacity: number; // mL/時
  requiredTankCapacity: number; // L
}

// 飽和水蒸気圧を計算する関数
function calculateSaturatedVaporPressure(temperature: number): number {
  // Clausius-Clapeyronの近似式における定数
  const A = 6.1078; // hPa
  const B = 17.269;
  const C = 237.3; // ℃

  // 飽和水蒸気圧 (hPa) を計算
  const saturatedVaporPressureHPa = A * Math.exp((B * temperature) / (temperature + C));

  // 水蒸気密度 (g/m³) に変換 (1 hPa = 100 Pa, 水蒸気の気体定数: 461.5 J/kg/K, 0℃ = 273.15K)
  const R = 461.5; // J/kg/K
  const T = temperature + 273.15; // K
  const saturatedVaporDensity = (saturatedVaporPressureHPa * 100) / (R * T);

  return saturatedVaporDensity * 1000; // g/m³に変換
}

// 加湿器の必要スペックを計算する関数
export function calculateHumidifierRequirements(
  area: number, // 平米数 (m²)
  targetHumidity: number, // 目標湿度 (%)
  roomTemperature: number, // 室温 (°C)
  continuousOperationHours = 8, // 連続運転時間 (時間)
  ceilingHeight = 2.4, // 天井高 (m)
  ventilationRate = 0.5, // 換気回数 (回/時)
  initialHumidity = 20 // 初期湿度(%)
): CalculationResult {
  // 部屋の容積を計算
  const roomVolume = area * ceilingHeight; // m³

  // 飽和水蒸気量 (温度による変動は考慮)
  const saturatedVaporDensity = calculateSaturatedVaporPressure(roomTemperature); // g/m³

  // 目標湿度時の水分量
  const targetMoistureAmount = roomVolume * saturatedVaporDensity * (targetHumidity / 100);

  // 初期湿度時の水分量
  const initialMoistureAmount = roomVolume * saturatedVaporDensity * (initialHumidity / 100);

  // 加湿に必要な水分量
  const requiredMoistureAmount = targetMoistureAmount - initialMoistureAmount;

  // 1時間あたりの換気量
  const ventilationVolume = roomVolume * ventilationRate; // m³/時

  // 換気によって失われる水分量 (目標湿度を維持するため)
  const moistureLossFromVentilation = ventilationVolume * saturatedVaporDensity * (targetHumidity / 100); // g/時

  // 必要な加湿能力 (g/時)
  const requiredHumidificationCapacityG = Math.max(moistureLossFromVentilation, requiredMoistureAmount / 1);

  // 必要な加湿能力 (mL/時) (1gの水 = 1mLと近似)
  const requiredHumidificationCapacity = requiredHumidificationCapacityG;

  // 必要なタンク容量 (L)
  const requiredTankCapacity = (requiredHumidificationCapacity / 1000) * continuousOperationHours;

  return {
    requiredHumidificationCapacity: Math.round(requiredHumidificationCapacity),
    requiredTankCapacity: Number.parseFloat(requiredTankCapacity.toFixed(1))
  };
}
