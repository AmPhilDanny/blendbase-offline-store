export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} BlendBase Offline Store. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <p>Support: support@blendbase.store</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
