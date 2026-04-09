// src/lib/components/chartMappers.ts

import { CHANNEL_MAP, GRADE_MAP, STATUS_MAP, SUBJECT_MAP } from "../../../routes/stores/dataStore";


const SUBJECT_COLORS = [
  '#32bea6', '#87a7c4', '#f2c461', '#fb0247', '#5d2b6e',
  '#ff8c00', '#4682b4', '#9acd32', '#d2691e', '#6a5acd',
  '#ff69b4', '#20b2aa', '#778899', '#bdb76b'
];

// --- INTERFÉSZEK EXPORTÁLÁSA ---
// Ezeket a +page.svelte is be tudja majd importálni!

export interface ChartDataDatasets {
  labels: string[];
  datasets: {
    label: string;
    backgroundColor: string;
    data: number[];
  }[];
}

export interface ChartDataSimple {
  labels: string[];
  data: number[];
  colors: string[];
}

// --- KONSTANSOK ÉS SEGÉDFÜGGVÉNYEK ---

const GRADE_COLORS = ['#32bea6', '#87a7c4', '#f2c461', '#fb0247', '#5d2b6e'];

function calcPerc(value: number, total: number): number {
  return total !== 0 ? Math.round((value * 100) / total) : 0;
}

// --- MAPPER FÜGGVÉNYEK ---

// 1. Grafikon (Bar) - Visszatérési típus megadva: : ChartDataDatasets
export function mapCountryStatusData(statusCountry: any[]): ChartDataDatasets {
  if (!statusCountry || statusCountry.length === 0) {
    return { labels: [], datasets: [] };
  }

  const labels = statusCountry.map((item) => item.country_name);

  return {
    labels,
    datasets: [
      {
        label: 'INTERESTED TOTAL',
        backgroundColor: 'rgb(251, 2, 71)',
        data: statusCountry.map((item) => item.total_intrest_count)
      },
      {
        label: 'INTERESTED / NOT APPLIED',
        backgroundColor: 'rgb(235, 120, 143)',
        data: statusCountry.map((item) => item.intrest_count_status_0)
      },
      {
        label: 'INTERESTED / APPLIED',
        backgroundColor: 'rgb(93, 43, 110)',
        data: statusCountry.map((item) => item.intert)
      },
      {
        label: STATUS_MAP.find(s => s.id === 1)?.name || 'Admitted',
        backgroundColor: 'rgb(50, 190, 166)',
        data: statusCountry.map((item) => item.intrest_count_status_1)
      },
      {
        label: STATUS_MAP.find(s => s.id === 2)?.name || 'Rejected',
        backgroundColor: 'rgb(135, 167, 196)',
        data: statusCountry.map((item) => item.intrest_count_status_2)
      },
      {
        label: STATUS_MAP.find(s => s.id === 3)?.name || 'In Progress',
        backgroundColor: 'rgb(242, 196, 97)',
        data: statusCountry.map((item) => item.intrest_count_status_3)
      }
    ]
  };
}

// 2. és 3. Donut
export function mapGradeData(data: any): ChartDataSimple {
  if (!data) {
    return { labels: [], data: [], colors: GRADE_COLORS };
  }

  const item = Array.isArray(data) ? data[0] : data;

  if (!item) return { labels: [], data: [], colors: GRADE_COLORS };

  const values: number[] = [];
  const labels: string[] = [];

  GRADE_MAP.forEach((grade: { id: string | number; name: string }) => {
    const key = `intrest_grade_status_${grade.id}`;
    values.push(item[key] || 0);
    labels.push(grade.name);
  });

  const total = values.reduce((sum, val) => sum + val, 0);

  return {
    labels: labels,
    data: values.map(v => calcPerc(v, total)),
    colors: GRADE_COLORS
  };
}

// 4. és 5. donut
export function mapSubjectData(data: any): ChartDataSimple {
  if (!data) {
    return { labels: [], data: [], colors: SUBJECT_COLORS };
  }

  const item = Array.isArray(data) ? data[0] : data;

  if (!item) {
    return { labels: [], data: [], colors: SUBJECT_COLORS };
  }

  const values: number[] = [];
  const labels: string[] = [];

  // 2. Adatok kinyerése és nevek hozzárendelése a subjectMap alapján
  // Ez biztosítja, hogy pontosan azokat a kulcsokat keressük, amik a mapben vannak
  SUBJECT_MAP.forEach((subject: { id: string | number; name: string }) => {
    const workTitleKey = `intrest_work_title_${subject.id}`;

    values.push(item[workTitleKey] || 0);
    labels.push(subject.name);
  });

  const subjectTotal = values.reduce((sum, value) => sum + value, 0);

  return {
    labels: labels,
    data: values.map(v => calcPerc(v, subjectTotal)),
    colors: SUBJECT_COLORS
  };
}

// 6. Grafikon
export function mapRegionData(regionIntrest: any[], regionAdmitted: any[]): ChartDataDatasets {
  if (!regionIntrest || regionIntrest.length === 0) return { labels: [], datasets: [] };

  const labels = regionIntrest.map((item) => item.region_name);

  return {
    labels,
    datasets: [
      {
        label: 'INTERESTED STUDENTS',
        backgroundColor: 'rgb(251, 2, 71)',
        data: regionIntrest.map((item) => item.intrest_count)
      },
      {
        label: 'ADMITTED STUDENTS',
        backgroundColor: 'rgb(50, 190, 166)',
        data: labels.map((label) => {
          const adm = regionAdmitted?.find((a) => a.region_name === label);
          return adm ? adm.intrest_count : 0;
        })
      }
    ]
  };
}

// 7. Grafikon
export function mapChannelData(channelIntrest: any[], channelAdmitted: any[]): ChartDataDatasets {
  if (!channelIntrest || channelIntrest.length === 0) return { labels: [], datasets: [] };

  const labels = channelIntrest.map((item) => {
    const channel = CHANNEL_MAP.find((c: any) => c.id === item.channel);
    return channel ? channel.name : 'Unknown';
  });

  return {
    labels,
    datasets: [
      {
        label: 'INTERESTED STUDENTS',
        backgroundColor: 'rgb(251, 2, 71)',
        data: channelIntrest.map((item) => item.intrest_count)
      },
      {
        label: 'ADMITTED STUDENTS',
        backgroundColor: 'rgb(50, 190, 166)',
        data: channelIntrest.map((item) => {
          const adm = channelAdmitted?.find((a) => a.channel === item.channel);
          return adm ? adm.intrest_count : 0;
        })
      }
    ]
  };
}
