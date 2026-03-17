import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const DEFAULT_SITE_SETTINGS = {
  videoUrl: 'https://vimeo.com/1173352905',
  donorFuseCampaignId: 11426,
  donorFuseLink: 'cm',
};

const buildVimeoEmbedUrl = (id) => `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`;

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
  const vimeoId = parseVimeoId(rawVideoUrl) || parseVimeoId(DEFAULT_SITE_SETTINGS.videoUrl);
  const donorFuseCampaignId = Number(row?.donorfuse_campaign_id);

  return {
    videoUrl: rawVideoUrl,
    videoEmbedUrl: buildVimeoEmbedUrl(vimeoId),
    vimeoId,
    donorFuseCampaignId: Number.isFinite(donorFuseCampaignId)
      ? donorFuseCampaignId
      : DEFAULT_SITE_SETTINGS.donorFuseCampaignId,
    donorFuseLink: normalizeDonorFuseLink(row?.donorfuse_link),
  };
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState(normalizeSettings(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('site_settings')
      .select('video_url, donorfuse_campaign_id, donorfuse_link')
      .limit(1);

    if (fetchError) {
      setError(fetchError.message || 'Failed to load site settings');
      setSettings(normalizeSettings(null));
      setLoading(false);
      return;
    }

    setSettings(normalizeSettings(data?.[0]));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { settings, loading, error, refresh };
};
