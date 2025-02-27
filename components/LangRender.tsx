const renderLanguage = (language: string) => {
  const flagMap: Record<string, string> = {
    "it-IT": "🇮🇹",
    "en-US": "🇺🇸",
    "en-GB": "🇬🇧",
    "fr-FR": "🇫🇷",
    "de-DE": "🇩🇪",
    "es-ES": "🇪🇸",
    "pt-BR": "🇧🇷",
    "ja-JP": "🇯🇵",
    "ko-KR": "🇰🇷",
    "zh-CN": "🇨🇳",
    "ru-RU": "🇷🇺",
  };

  return <div>{flagMap[language] || language}</div>;
};

export default renderLanguage;
