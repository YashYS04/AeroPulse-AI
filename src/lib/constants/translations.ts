// ============================================================
// src/lib/constants/translations.ts
// Multilingual dictionary with Arabic RTL & typography support
// ============================================================

import { Language } from '@/types';

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  tabs: {
    dashboard: string;
    assistant: string;
    routine: string;
    impact: string;
    iaq: string;
    transit: string;
    community: string;
  };
  metrics: {
    aqiLabel: string;
    pm25Label: string;
    inversionActive: string;
    inversionNormal: string;
    safeWindow: string;
  };
  actions: {
    simulateSpike: string;
    simulateClean: string;
    askCopilot: string;
    joinPledge: string;
    leavePledge: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  [Language.EN]: {
    appTitle: 'AeroPulse AI',
    appSubtitle: 'Urban Air Quality & Smog Resilience Assistant',
    tabs: {
      dashboard: 'Air Telemetry',
      assistant: 'GenAI Copilot',
      routine: 'Daily Routine',
      impact: 'Direct Impact',
      iaq: 'Indoor Hacks',
      transit: 'Clean Transit',
      community: 'Community Hub',
    },
    metrics: {
      aqiLabel: 'Air Quality Index',
      pm25Label: 'Fine Particulates (PM2.5)',
      inversionActive: 'Thermal Inversion Active',
      inversionNormal: 'Normal Vertical Mixing',
      safeWindow: 'Optimal Outdoor Window',
    },
    actions: {
      simulateSpike: 'Simulate Smog Spike',
      simulateClean: 'Simulate Solar Clearing',
      askCopilot: 'Consult AI Assistant',
      joinPledge: 'Join Pledge',
      leavePledge: 'Leave Pledge',
    },
  },
  [Language.HI]: {
    appTitle: 'एयरोपल्स एआई',
    appSubtitle: 'शहरी वायु गुणवत्ता एवं स्मॉग सुरक्षा सहायक',
    tabs: {
      dashboard: 'वायु गुणवत्ता स्थिति',
      assistant: 'एआई सलाहकार',
      routine: 'दैनिक दिनचर्या',
      impact: 'प्रत्यक्ष प्रभाव',
      iaq: 'घरेलू वायु उपाय',
      transit: 'स्वच्छ यात्रा',
      community: 'सामुदायिक केंद्र',
    },
    metrics: {
      aqiLabel: 'वायु गुणवत्ता सूचकांक',
      pm25Label: 'सूक्ष्म धूलकण (PM2.5)',
      inversionActive: 'थर्मल इन्वर्जन सक्रिय',
      inversionNormal: 'सामान्य वायु परिसंचरण',
      safeWindow: 'सुरक्षित बाहरी समय',
    },
    actions: {
      simulateSpike: 'प्रदूषण वृद्धि का अनुकरण',
      simulateClean: 'स्वच्छ वायु का अनुकरण',
      askCopilot: 'एआई से परामर्श लें',
      joinPledge: 'प्रतिज्ञा से जुड़ें',
      leavePledge: 'प्रतिज्ञा छोड़ें',
    },
  },
  [Language.ZH]: {
    appTitle: 'AeroPulse 智空气',
    appSubtitle: '城市空气质量与冬季雾霾应对助手',
    tabs: {
      dashboard: '空气遥测',
      assistant: 'AI 智囊伙伴',
      routine: '日常防霾日程',
      impact: '减排直观影响',
      iaq: '室内自制净化',
      transit: '低吸入通勤',
      community: '社区联合行动',
    },
    metrics: {
      aqiLabel: '空气质量指数 (AQI)',
      pm25Label: '细颗粒物 (PM2.5)',
      inversionActive: '逆温层逆转中',
      inversionNormal: '垂直扩散正常',
      safeWindow: '适宜外出窗口',
    },
    actions: {
      simulateSpike: '模拟雾霾峰值',
      simulateClean: '模拟阳光消散',
      askCopilot: '咨询智能助手',
      joinPledge: '加入环保承诺',
      leavePledge: '退出承诺',
    },
  },
  [Language.AR]: {
    appTitle: 'إيروبالس للذكاء الاصطناعي',
    appSubtitle: 'مساعد جودة الهواء الحضري ومقاومة الضباب الدخاني',
    tabs: {
      dashboard: 'مؤشرات الهواء',
      assistant: 'المساعد الذكي',
      routine: 'الروتين اليومي',
      impact: 'الأثر المباشر',
      iaq: 'تنقية الهواء الداخلي',
      transit: 'المسار النظيف',
      community: 'مركز المجتمع',
    },
    metrics: {
      aqiLabel: 'مؤشر جودة الهواء',
      pm25Label: 'الجسيمات الدقيقة (PM2.5)',
      inversionActive: 'الانقلاب الحراري نشط',
      inversionNormal: 'الانتشار الرأسي طبيعي',
      safeWindow: 'النافذة الخارجية الآمنة',
    },
    actions: {
      simulateSpike: 'محاكاة ذروة الضباب الدخاني',
      simulateClean: 'محاكاة التشتت الشمسي',
      askCopilot: 'استشر الذكاء الاصطناعي',
      joinPledge: 'الانضمام للتعهد',
      leavePledge: 'مغادرة التعهد',
    },
  },
};
