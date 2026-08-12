/**
 * Storage utility for managing image uploads.
 * Uses Supabase Storage if NEXT_PUBLIC_SUPABASE_URL is configured,
 * otherwise provides an inline data URL fallback for local development.
 */
export async function uploadImageToStorage(file: File): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('catalog-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) {
        console.warn('Supabase upload error, using fallback URL:', error.message);
      } else if (data) {
        const { data: publicData } = supabase.storage
          .from('catalog-images')
          .getPublicUrl(filePath);
        return publicData.publicUrl;
      }
    } catch (e) {
      console.warn('Supabase client error, falling back:', e);
    }
  }

  // Fallback: Convert file to Base64 Data URL for local preview/storage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
