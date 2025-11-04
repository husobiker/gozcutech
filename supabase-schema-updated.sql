-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  source VARCHAR(50) DEFAULT 'website',
  ip_address INET,
  user_agent TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  project_type VARCHAR(50),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  source VARCHAR(50) DEFAULT 'website',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog comments table (for future use)
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media uploads table
CREATE TABLE IF NOT EXISTS media_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  upload_type VARCHAR(50) DEFAULT 'general' CHECK (upload_type IN ('general', 'blog', 'project', 'profile')),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  event_category VARCHAR(100),
  event_label VARCHAR(255),
  event_value INTEGER,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id VARCHAR(255),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for newsletters
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Allow public to insert newsletter subscriptions
CREATE POLICY "Allow public newsletter subscription" ON newsletters
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read all newsletters (admin)
CREATE POLICY "Allow authenticated read newsletters" ON newsletters
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update newsletters (admin)
CREATE POLICY "Allow authenticated update newsletters" ON newsletters
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert contact messages
CREATE POLICY "Allow public contact message" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read all contact messages (admin)
CREATE POLICY "Allow authenticated read contact messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update contact messages (admin)
CREATE POLICY "Allow authenticated update contact messages" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for blog_comments
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Allow public to insert blog comments
CREATE POLICY "Allow public blog comment" ON blog_comments
  FOR INSERT WITH CHECK (true);

-- Allow public to read approved blog comments
CREATE POLICY "Allow public read approved blog comments" ON blog_comments
  FOR SELECT USING (status = 'approved');

-- Allow authenticated users to read all blog comments (admin)
CREATE POLICY "Allow authenticated read all blog comments" ON blog_comments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update blog comments (admin)
CREATE POLICY "Allow authenticated update blog comments" ON blog_comments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for media_uploads
ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert media uploads
CREATE POLICY "Allow authenticated insert media uploads" ON media_uploads
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public to read media uploads (for serving files)
CREATE POLICY "Allow public read media uploads" ON media_uploads
  FOR SELECT USING (true);

-- Allow authenticated users to delete their own media uploads
CREATE POLICY "Allow authenticated delete own media uploads" ON media_uploads
  FOR DELETE USING (auth.uid() = uploaded_by);

-- RLS Policies for analytics_events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow public to insert analytics events
CREATE POLICY "Allow public analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read analytics events (admin)
CREATE POLICY "Allow authenticated read analytics events" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletters_email ON newsletters(email);
CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON newsletters(created_at);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at);

CREATE INDEX IF NOT EXISTS idx_media_uploads_type ON media_uploads(upload_type);
CREATE INDEX IF NOT EXISTS idx_media_uploads_created_at ON media_uploads(created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON newsletters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON blog_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();




