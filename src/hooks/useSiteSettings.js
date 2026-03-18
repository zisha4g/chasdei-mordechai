import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const DEFAULT_SITE_SETTINGS = {
  videoUrl: 'https://vimeo.com/1173352905',
  donorFuseCampaignId: 11426,
  donorFuseLink: 'cm',
};

const buildVimeoEmbedUrl = (id) => `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`;
const buildYouTubeEmbedUrl = (id) => `https://www.youtube.com/embed/${id}?rel=0`;

export const parseVimeoId = (value) => {
  const input = String(value || '').trim();
  if (!input) return '';
  if (/^\d+$/.test(input)) return input;

  const directMatch = input.match(/player\.vimeo\.com\/video\/(\d+)/i);
  if (directMatch?.[1]) return directMatch[1];

  const pageMatch = input.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (pageMatch?.[1]) return pageMatch[1];

  return '';
};

export const parseYouTubeId = (value) => {
  const input = String(value || '').trim();
  if (!input) return '';

  const shortMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (shortMatch?.[1]) return shortMatch[1];

  const watchMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch?.[1]) return watchMatch[1];

  const embedMatch = input.match(/youtube\.com\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch?.[1]) return embedMatch[1];

  return '';
};

const normalizeVideoSettings = (value) => {
  const input = String(value || '').trim() || DEFAULT_SITE_SETTINGS.videoUrl;
  const vimeoId = parseVimeoId(input);
  if (vimeoId) {
    return {
      videoUrl: input,
      videoEmbedUrl: buildVimeoEmbedUrl(vimeoId),
      vimeoId,
      videoProvider: 'vimeo',
    };
  }

  const youtubeId = parseYouTubeId(input);
  if (youtubeId) {
    return {
      videoUrl: input,
      videoEmbedUrl: buildYouTubeEmbedUrl(youtubeId),
      vimeoId: '',
      videoProvider: 'youtube',
    };
  }

  const defaultVimeoId = parseVimeoId(DEFAULT_SITE_SETTINGS.videoUrl);
  return {
    videoUrl: input,
    videoEmbedUrl: defaultVimeoId ? buildVimeoEmbedUrl(defaultVimeoId) : input,
    vimeoId: defaultVimeoId,
    videoProvider: defaultVimeoId ? 'vimeo' : 'custom',
  };
};

const normalizeDonorFuseLink = (value) => {
  const input = String(value || '').trim();
  if (!input) return DEFAULT_SITE_SETTINGS.donorFuseLink;

  try {
    if (input.startsWith('http://') || input.startsWith('https://')) {
      const url = new URL(input);
      return url.pathname.replace(/^\/+|\/+$/g, '') || DEFAULT_SITE_SETTINGS.donorFuseLink;
    }
  } catch {
    // Fall through to plain slug normalization.
  }

  return input.replace(/^\/+|\/+$/g, '') || DEFAULT_SITE_SETTINGS.donorFuseLink;
};

const normalizeSettings = (row) => {
  const rawVideoUrl = String(row?.video_url || '').trim() || DEFAULT_SITE_SETTINGS.videoUrl;
  const donorFuseCampaignId = Number(row?.donorfuse_campaign_id);
  const videoSettings = normalizeVideoSettings(rawVideoUrl);

  return {
    ...videoSettings,
    donorFuseCampaignId: Number.isFinite(donorFuseCampaignId)
      ? donorFuseCampaignId
      : DEFAULT_SITE_SETTINGS.donorFuseCampaignId,
    donorFuseLink: normalizeDonorFuseLink(row?.donorfuse_link),
  };
};

export const fetchLatestSiteSettings = () => (
  supabase
    .from('site_settings')
    .select('id, video_url, donorfuse_campaign_id, donorfuse_link')
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle()
);

export const useSiteSettings = () => {
  const [settings, setSettings] = useState(normalizeSettings(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await fetchLatestSiteSettings();

    if (fetchError) {
      setError(fetchError.message || 'Failed to load site settings');
      setSettings(normalizeSettings(null));
      setLoading(false);
      return;
    }

    setSettings(normalizeSettings(data));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { settings, loading, error, refresh };
};
