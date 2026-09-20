// 科研数据集 / 科研指标库 共用的演示数据

export interface DatasetTable {
  id: string;
  name: string;
  code: string;
  changed: boolean; // 有字段属性变更，待同步
  isNew?: boolean;  // 本次新同步
}

export interface PendingTable {
  id: number;
  name: string;
  code: string;
  changed: boolean;     // true: 有字段属性变更的表（蓝色）；false: 未同步的表（黑色）
  updateName: boolean;  // 同步时是否更新绑定的指标库指标名称
}

export interface DiseaseDataset {
  tables: DatasetTable[];
  pending: PendingTable[];
}

export interface Indicator {
  id: string;
  name: string;
  field: string;
  fieldType: string;
  fillRate: number;
  dataType: string;
  searchType: string;
  domain: string;
  code: string;
  desc: string;
}

export interface TableField {
  cn: string;
  en: string;
  type: string;
  indicator: string;
}

export const DATASET_DISEASES = [
  '通用数据模型', '肝细胞癌专病库', '乳腺癌专病库', '胃肠癌专病库', '盆底功能障碍专病库', '宫颈癌专病库',
  '卵巢癌专病库', '子宫内膜癌专病库', '心力衰竭专病库', '数据导入', 'A0327妇科专病库', '0401', '0401-1',
];

export const INDICATOR_DISEASES = [
  '科研通用库', '肝癌高危人群', '测试专病', '胃肠癌', '肝细胞癌', '乳腺癌', '心力衰竭',
  '盆底障碍', '卵巢癌', '内膜癌', '宫颈癌', '肺癌', '慢阻肺', '哮喘',
];

export interface TreeGroup {
  name: string;
  children: { name: string; code: string }[];
}

export const INDICATOR_TREE: TreeGroup[] = [
  { name: '患者基本信息', children: [{ name: '患者基本信息', code: 'dw_rdr_pat_info' }] },
  { name: '就诊记录', children: [{ name: '门诊就诊记录', code: 'dw_rdr_opd_visit' }, { name: '住院就诊记录', code: 'dw_rdr_ipd_visit' }] },
  { name: '临床诊断', children: [{ name: '门诊诊断', code: 'dw_rdr_opd_diag' }, { name: '出院诊断', code: 'dw_rdr_dis_diag' }] },
  { name: '用药信息', children: [{ name: '医嘱用药', code: 'dw_rdr_order_drug' }, { name: '手术用药', code: 'dw_rdr_aims_drug' }] },
  { name: '检查报告', children: [{ name: '影像检查', code: 'dw_mmd_dicom_studyinfo' }, { name: '超声检查', code: 'dw_rdr_us_report' }] },
  { name: '检验信息', children: [{ name: '检验结果', code: 'dw_rdr_lis_result' }] },
  { name: '病程记录', children: [{ name: '首次病程记录', code: 'dw_rdr_emr_first_course' }, { name: '日常病程记录', code: 'dw_rdr_emr_daily_course' }] },
  { name: '病案手术信息', children: [{ name: '病案手术信息', code: 'dw_rdr_med_ope_full' }] },
];

export const PATIENT_INFO_CODE = 'dw_rdr_pat_info';

export const DATA_TYPES = ['无', '无序', '有序', '日期', '数值'];
export const SEARCH_TYPES = ['文本输入', '值选择-单选', '值选择-多选', '日期范围', '数值范围'];

// [指标名称, 字段类型, 填充率, 数据类型, 检索类型, 检索值域]
const PATIENT_INFO_ROWS: [string, string, number, string, string, string?][] = [
  ['empi', 'varchar', 5.09, '无', '文本输入'], ['患者id', 'varchar', 100, '无', '文本输入'], ['姓名', 'varchar', 100, '无', '文本输入'],
  ['别名', 'varchar', 0, '无', '文本输入'], ['性别', 'varchar', 100, '无序', '值选择-单选', '生理性别代码表'], ['出生日期', 'date', 48.42, '日期', '日期范围'],
  ['婚姻状态', 'varchar', 100, '无', '文本输入'], ['ABO血型', 'varchar', 100, '无', '文本输入'], ['Rh血型', 'varchar', 100, '无', '文本输入'],
  ['残疾码', 'varchar', 0, '无', '文本输入'], ['残疾名称', 'varchar', 0, '无', '文本输入'], ['民族', 'varchar', 96.3, '无序', '值选择-单选', '民族代码表'],
  ['国籍', 'varchar', 88.12, '无序', '值选择-单选', '国家和地区代码表'], ['职业', 'varchar', 62.4, '无序', '值选择-多选', '职业分类代码表'],
  ['学历', 'varchar', 41.07, '有序', '值选择-单选', '学历代码表'], ['身份证号', 'varchar', 97.55, '无', '文本输入'], ['联系电话', 'varchar', 92.18, '无', '文本输入'],
  ['现住址', 'varchar', 85.6, '无', '文本输入'], ['户籍地址', 'varchar', 70.33, '无', '文本输入'], ['出生地', 'varchar', 55.9, '无', '文本输入'],
  ['籍贯', 'varchar', 52.11, '无', '文本输入'], ['工作单位', 'varchar', 31.2, '无', '文本输入'], ['联系人姓名', 'varchar', 76.45, '无', '文本输入'],
  ['联系人关系', 'varchar', 74.02, '无序', '值选择-单选', '家庭关系代码表'], ['联系人电话', 'varchar', 75.8, '无', '文本输入'],
  ['医保类型', 'varchar', 90.66, '无序', '值选择-单选', '医疗保险类别代码表'], ['医保卡号', 'varchar', 66.3, '无', '文本输入'],
  ['年龄', 'int', 100, '数值', '数值范围'], ['身高', 'decimal', 58.2, '数值', '数值范围'], ['体重', 'decimal', 61.47, '数值', '数值范围'], ['BMI', 'decimal', 55.03, '数值', '数值范围'],
  ['吸烟史', 'varchar', 46.8, '无序', '值选择-单选', '是否代码表'], ['饮酒史', 'varchar', 45.12, '无序', '值选择-单选', '是否代码表'], ['过敏史', 'varchar', 38.9, '无', '文本输入'],
  ['家族肿瘤史', 'varchar', 22.6, '无', '文本输入'], ['乙肝病毒感染', 'varchar', 64.3, '无序', '值选择-单选', '是否代码表'],
  ['丙肝病毒感染', 'varchar', 60.18, '无序', '值选择-单选', '是否代码表'], ['肝硬化', 'varchar', 57.4, '无序', '值选择-单选', '是否代码表'],
  ['糖尿病史', 'varchar', 49.9, '无序', '值选择-单选', '是否代码表'], ['高血压史', 'varchar', 51.25, '无序', '值选择-单选', '是否代码表'],
  ['首次就诊日期', 'date', 99.1, '日期', '日期范围'], ['末次就诊日期', 'date', 99.1, '日期', '日期范围'], ['就诊次数', 'int', 100, '数值', '数值范围'],
  ['住院次数', 'int', 100, '数值', '数值范围'], ['是否死亡', 'varchar', 100, '无序', '值选择-单选', '是否代码表'], ['死亡日期', 'date', 3.2, '日期', '日期范围'],
  ['死亡原因', 'varchar', 2.9, '无', '文本输入'], ['随访状态', 'varchar', 35.7, '无序', '值选择-单选', '随访状态代码表'], ['末次随访日期', 'date', 33.5, '日期', '日期范围'],
  ['建档机构', 'varchar', 100, '无', '文本输入'], ['建档日期', 'date', 100, '日期', '日期范围'], ['数据来源', 'varchar', 100, '无序', '值选择-多选', '数据来源代码表'],
  ['更新时间', 'datetime', 100, '日期', '日期范围'], ['患者标签', 'varchar', 12.4, '无', '文本输入'], ['备注', 'varchar', 8.6, '无', '文本输入'],
];

export function buildIndicators(dsCode: string): Indicator[] {
  const rows: [string, string, number, string, string, string?][] = dsCode === PATIENT_INFO_CODE
    ? PATIENT_INFO_ROWS
    : ['记录id', '患者id', '就诊号', '记录时间', '科室名称', '医生姓名', '记录内容', '数据来源'].map((n, i) => [
        n, i === 3 ? 'datetime' : 'varchar', Math.round((100 - i * 9.7) * 100) / 100, i === 3 ? '日期' : '无', i === 3 ? '日期范围' : '文本输入',
      ]);
  return rows.map(([name, fieldType, fillRate, dataType, searchType, domain], i) => ({
    id: `${dsCode}_${i}`, name, field: name, fieldType, fillRate, dataType, searchType,
    domain: domain || '', code: `IDX_${1001 + i}`, desc: `记录患者的${name}`,
  }));
}

/* ------------------------------------------------------------------
 * 按科研库区分的指标库数据（用于演示「从通用库引入」）
 * 第 0 个科研库「科研通用库」为通用库，其余为专病库
 * ------------------------------------------------------------------ */

export const GENERAL_LIB = 0;

export interface LibGroup {
  name: string;
  tables: { name: string; code: string }[];
}

// 专病库在建库时引用的通用库表
export const REFERENCED_CODES = ['dw_rdr_pat_info', 'dw_rdr_opd_visit', 'dw_rdr_ipd_visit', 'dw_rdr_opd_diag', 'dw_rdr_lis_result', 'dw_mmd_dicom_studyinfo'];

export const ownTableCode = (lib: number) => `dw_zb${lib}_followup`;

export function findGeneralTable(code: string) {
  for (const g of INDICATOR_TREE) {
    const t = g.children.find(c => c.code === code);
    if (t) return { group: g.name, table: t };
  }
  return null;
}

export function buildLibTree(lib: number, libName: string): LibGroup[] {
  if (lib === GENERAL_LIB) return INDICATOR_TREE.map(g => ({ name: g.name, tables: g.children.map(c => ({ ...c })) }));
  return [
    { name: '患者信息', tables: [{ name: '患者基础信息', code: PATIENT_INFO_CODE }] }, // 管理员手动配置过：改了目录名和表名
    { name: '检验信息', tables: [] },                                                // 手动建的空目录，与通用库目录同名
    { name: `${libName}专病`, tables: [{ name: `${libName}随访记录`, code: ownTableCode(lib) }] }, // 专病库自建表
  ];
}

export function buildLibIndicators(lib: number, dsCode: string): Indicator[] {
  if (lib === GENERAL_LIB || dsCode === ownTableCode(lib)) return buildIndicators(dsCode);
  const general = buildIndicators(dsCode);
  const fill = (v: number) => Math.round(v * 0.92 * 100) / 100;
  if (dsCode === PATIENT_INFO_CODE) {
    // 手动配置过的表：个别定义与通用库不同，并有一个专病库自建指标
    const rows = general.map((r, i) => ({
      ...r, fillRate: fill(r.fillRate), desc: '',
      ...(i === 0 ? { name: '主索引号' } : {}),
      ...(r.name === '性别' ? { searchType: '文本输入', domain: '' } : {}),
    }));
    return [...rows, {
      id: `${dsCode}_own`, name: '肝癌分期', field: '肝癌分期', fieldType: 'varchar', fillRate: 76.4, dataType: '有序',
      searchType: '值选择-单选', domain: 'BCLC分期代码表', code: 'IDX_9001', desc: '专病库自建指标',
    }];
  }
  // 建库时只复制了检索和导出配置，指标定义还是默认值
  return general.map((r, i) => ({ ...r, name: `fld_${String(i + 1).padStart(3, '0')}`, dataType: '无', desc: '', fillRate: fill(r.fillRate) }));
}

export function buildDiseaseDataset(index: number): DiseaseDataset {
  let tableNames: string[];
  let pending: [string, string, boolean][];
  if (index === 0) {
    tableNames = ['检查报告', '测试1001', 'Mr.张的通用库表单', '2.1.0基础表单', 'sss', '测试0624_lfl', '手术记录', '基本信息', '测试1', '长题目',
      '突变基因', '基因外显子测序报告', '可疑突变基因', '患者1111', '全类型', '表格表单', '新增112', '子表单', 'CT检查', '测试自定义表单', '乳腺癌随访表', '手术记录表单'];
    pending = [
      ['影像检查', 'dw_mmd_dicom_studyinfo', false], ['手术用药', 'dw_rdr_aims_drug2', false], ['出院记录', 'dw_rdr_emr_dis_full_daily', false],
      ['手术记录', 'dw_rdr_emr_ope_full_daily', false], ['病案手术', 'dw_rdr_med_ope_full_daily', false], ['入院记录', 'dw_rdr_emr_adm_full_daily', false],
      ['检验结果', 'dw_rdr_lis_result_daily', false], ['门诊诊断', 'dw_rdr_opd_diag_daily', false], ['医嘱信息', 'dw_rdr_emr_order_daily', false],
      ['生命体征', 'dw_rdr_nur_vital_sign', false], ['病理报告', 'dw_rdr_pat_report_daily', false],
      ['乳腺癌_既往史_手术操作', 'dw_rdr_nlp_bc_fam_diag', false], ['乳腺癌_组织病理学', 'dw_rdr_nlp_bc_histo_path', false],
      ['乳腺癌_影像诊断', 'dw_rdr_nlp_bc_image_diag', false], ['乳腺癌_影像特征', 'dw_rdr_nlp_bc_image_fea', false],
      ['乳腺癌_免疫组化', 'dw_rdr_nlp_bc_ihc', false], ['乳腺癌_分子分型', 'dw_rdr_nlp_bc_molecular', false],
      ['乳腺癌_新辅助治疗_化疗方案及疗效评估记录', 'dw_rdr_nlp_bc_neoadjuvant_chemo_regimen_evaluation', false],
      ['乳腺癌_术后辅助内分泌治疗用药及不良反应随访', 'dw_rdr_nlp_bc_adjuvant_endocrine_therapy_followup', false],
      ['子表单', 'form_106_1_fne8moktfzxuafc', true], ['表格表单', 'form_106_1_fv4rmoktersjabc', true],
      ['可疑突变基因', 'form_221_1_f63tmp6qd09madc', true], ['突变基因', 'form_221_1_ff01mp6qcuopafc', true],
      ['基因外显子测序报告', 'form_221_1_fg7kmp6qd3wkadc', true], ['乳腺癌随访表', 'form_130_1_fbc9mpa1xk2dabc', true],
      ['检查报告', 'form_88_1_fjc2mo3kxq1babc', true], ['手术记录表单', 'form_96_1_fop3mo8vt1zqabc', true],
      ['form_57_1_fti1mogu0nqvazc', 'form_57_1_fti1mogu0nqvazc', false], ['form_57_1_ftvdmogu0pqnb5c', 'form_57_1_ftvdmogu0pqnb5c', false],
      ['测试自定义表单', 'form_table_106', true],
    ];
  } else {
    const base = DATASET_DISEASES[index].replace('专病库', '');
    tableNames = ['基本信息', '诊断信息', '治疗方案', '随访记录'].map(n => `${base}_${n}`);
    pending = [
      [`${base}_检验结果`, `dw_rdr_d${index}_lis_result`, false], [`${base}_影像检查`, `dw_rdr_d${index}_image`, false],
      [`${base}_病理报告`, `dw_rdr_d${index}_pathology`, false], [`${base}_随访记录`, `form_${index}_1_followup`, true],
      [`${base}_治疗方案`, `form_${index}_1_treatment`, true],
    ];
  }
  const tables = tableNames.map((name, k) => {
    const p = pending.find(([n, , changed]) => changed && n === name);
    return { id: `t${k}`, name, code: p ? p[1] : '', changed: !!p };
  });
  return {
    tables,
    pending: pending.map(([name, code, changed], id) => ({ id, name, code, changed, updateName: false })),
  };
}

export function fieldsOfTable(table: DatasetTable): TableField[] {
  if (table.name === '基本信息') {
    return PATIENT_INFO_ROWS.slice(0, 14).map(([name, type]) => ({
      cn: name, en: name === 'empi' ? 'empi' : `f_${name}`, type, indicator: name,
    }));
  }
  const pool: [string, string, string][] = [
    ['记录ID', 'record_id', 'varchar'], ['患者ID', 'patient_id', 'varchar'], ['就诊号', 'visit_no', 'varchar'], ['记录时间', 'record_time', 'datetime'],
    ['科室名称', 'dept_name', 'varchar'], ['项目名称', 'item_name', 'varchar'], ['结果', 'result_value', 'varchar'], ['结论', 'conclusion', 'text'],
    ['记录医生', 'doctor_name', 'varchar'], ['审核时间', 'audit_time', 'datetime'],
  ];
  return pool.slice(0, 6 + (table.name.length % 5)).map(([cn, en, type]) => ({ cn, en, type, indicator: '' }));
}
