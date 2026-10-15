{cartOpen && (
  <>
    {/* Backdrop overlay */}
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
      onClick={() => setCartOpen(false)}
    ></div>

    {/* Drawer panel */}
    <aside
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'ar' ? 'سلة التسوق' : 'Shopping cart'}
      onClick={e => e.stopPropagation()}
      className="fixed right-0 top-0 h-full w-full max-w-md flex flex-col bg-white p-5 shadow-2xl z-[70]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">
          {lang === 'ar' ? 'سلة التسوق' : 'Shopping cart'} ({count})
        </h2>
        <button
          onClick={() => setCartOpen(false)}
          aria-label={lang === 'ar' ? 'إغلاق السلة' : 'Close cart'}
          className="rounded-full border p-2"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="mt-5 flex-1 space-y-3 overflow-y-auto">
        {items.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            {lang === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}
          </p>
        ) : (
          items.map(item => (
            <div key={item.slug} className="rounded-xl border bg-gray-50 p-3">
              <Link
                onClick={() => setCartOpen(false)}
                href={`/shop/${item.slug}`}
                className="font-bold"
              >
                {item.name[lang]}
              </Link>
              <p className="mt-1 text-sm font-bold text-primary">
                {formatPrice(item.price, lang)}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => setQuantity(item.slug, item.quantity - 1)}
                  className="rounded-full border px-3 py-1"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => setQuantity(item.slug, item.quantity + 1)}
                  className="rounded-full border px-3 py-1"
                >
                  +
                </button>
                <button
                  onClick={() => remove(item.slug)}
                  className="ms-auto text-sm text-red-600"
                >
                  {lang === 'ar' ? 'إزالة' : 'Remove'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between font-extrabold">
          <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
          <span>{formatPrice(subtotal, lang)}</span>
        </div>
        <Link
          href="/cart"
          onClick={() => setCartOpen(false)}
          className="mt-3 block rounded-full border border-primary px-5 py-3 text-center font-bold text-primary"
        >
          {lang === 'ar' ? 'عرض السلة' : 'View cart'}
        </Link>
        <Link
          href="/checkout"
          onClick={() => setCartOpen(false)}
          className="mt-2 block rounded-full bg-primary px-5 py-3 text-center font-bold text-white"
        >
          {lang === 'ar' ? 'إتمام الطلب' : 'Checkout'}
        </Link>
      </div>
    </aside>
  </>
)}
