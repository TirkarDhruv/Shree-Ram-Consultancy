CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  service VARCHAR(80) NOT NULL,
  message TEXT,
  language VARCHAR(10) DEFAULT 'en',
  status VARCHAR(32) DEFAULT 'New',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_leads_created_at (created_at),
  INDEX idx_leads_status_created_at (status, created_at)
);
