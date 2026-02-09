import './globals.css'

export const metadata = {
  title: 'Alibaba Cloud OSS File Manager',
  description: 'Upload and manage files in Alibaba Cloud OSS bucket',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


