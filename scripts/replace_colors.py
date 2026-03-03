import os
import re

# Todos os arquivos que precisam ser atualizados
TARGET_FILES = [
    "components/ui/toast.tsx",
    "components/ui/table.tsx",
    "components/ui/switch.tsx",
    "components/ui/select.tsx",
    "components/ui/dialog.tsx",
    "components/ui/alert-dialog.tsx",
    "components/seller/seller-sidebar.tsx",
    "components/seller/seller-header.tsx",
    "components/public/categories-section.tsx",
    "components/public/featured-vehicles.tsx",
    "components/public/hero-section.tsx",
    "components/public/public-footer.tsx",
    "components/public/vehicles-page-client.tsx",
    "components/public/vehicle-gallery.tsx",
    "components/public/vehicle-gallery-client.tsx",
    "components/public/vehicle-details.tsx",
    "components/public/vehicle-cta-buttons.tsx",
    "components/public/vehicle-catalog.tsx",
    "components/public/vehicle-actions.tsx",
    "components/public/unified-chat.tsx",
    "components/public/test-drive-scheduler.tsx",
    "components/public/store-map.tsx",
    "components/public/recently-viewed.tsx",
    "components/public/price-filter-section.tsx",
    "components/public/online-proposal.tsx",
    "components/public/latest-blog-posts.tsx",
    "components/public/financing-simulator.tsx",
    "components/public/financing-calculator.tsx",
    "components/public/financing-calculator-client.tsx",
    "components/public/favorites-panel.tsx",
    "components/public/compare-panel.tsx",
    "components/public/chatbot.tsx",
    "components/public/car-evaluation.tsx",
    "components/public/advanced-filters.tsx",
    "components/admin/vehicles/vehicles-table.tsx",
    "components/admin/vehicles/vehicle-form.tsx",
    "components/customer/customer-sidebar.tsx",
    "components/customer/customer-header.tsx",
    "components/admin/blog/blog-posts-table.tsx",
    "components/auth/login-form.tsx",
    "components/admin/blog/blog-post-form.tsx",
    "components/admin/admin-sidebar.tsx",
    "components/admin/admin-header.tsx",
    "app/client-page.tsx",
    "app/seller/vehicles/page.tsx",
    "app/seller/sales/page.tsx",
    "app/seller/profile/page.tsx",
    "app/seller/page.tsx",
    "app/seller/layout.tsx",
    "app/seller/goals/page.tsx",
    "app/seller/documents/page.tsx",
    "app/seller/commissions/page.tsx",
    "app/registro/page.tsx",
    "app/not-found.tsx",
    "app/minha-conta/test-drives/page.tsx",
    "app/minha-conta/propostas/page.tsx",
    "app/minha-conta/perfil/page.tsx",
    "app/minha-conta/page.tsx",
    "app/minha-conta/layout.tsx",
    "app/minha-conta/historico/page.tsx",
    "app/minha-conta/favoritos/page.tsx",
    "app/minha-conta/avaliacoes/page.tsx",
    "app/minha-conta/alertas/page.tsx",
    "app/login/page.tsx",
    "app/comparar/page.tsx",
    "app/blog/page.tsx",
    "app/blog/loading.tsx",
    "app/api-docs/page.tsx",
    "app/admin/vehicles/page.tsx",
    "app/admin/page.tsx",
    "app/admin/layout.tsx",
    "app/admin/users/page.tsx",
    "app/admin/inquiries/page.tsx",
    "app/admin/test-drives/page.tsx",
    "app/admin/finance/page.tsx",
    "app/admin/sellers/page.tsx",
    "app/admin/evaluations/page.tsx",
    "app/admin/sales/page.tsx",
    "app/admin/reports/page.tsx",
    "app/admin/proposals/page.tsx",
]

# Substituições ordenadas do mais específico para o mais genérico
REPLACEMENTS = [
    # Gradientes compostos
    ("from-blue-950 via-blue-900 to-indigo-900", "from-gray-950 via-gray-900 to-red-950"),
    ("from-blue-950 via-blue-900 to-blue-800", "from-gray-950 via-gray-900 to-gray-900"),
    ("from-blue-900 via-blue-800 to-blue-700", "from-gray-900 via-gray-800 to-red-900"),
    ("hover:from-blue-700 hover:to-indigo-700", "hover:from-red-700 hover:to-red-800"),
    ("hover:from-blue-500 hover:to-cyan-500", "hover:from-red-500 hover:to-red-400"),
    ("from-blue-600 to-indigo-600", "from-red-600 to-red-700"),
    ("from-blue-600 to-cyan-600", "from-red-600 to-red-700"),
    ("from-blue-500 to-cyan-500", "from-red-500 to-red-400"),
    ("from-blue-500 to-indigo-500", "from-red-500 to-red-600"),
    ("from-blue-900 to-blue-800", "from-gray-900 to-gray-800"),
    ("from-blue-900 to-blue-700", "from-red-900 to-red-700"),
    ("from-blue-800 to-blue-700", "from-red-800 to-red-700"),
    ("from-blue-700 to-indigo-700", "from-red-700 to-red-800"),
    # Slate → gray (completo)
    ("slate-950", "gray-950"),
    ("slate-900", "gray-900"),
    ("slate-800", "gray-800"),
    ("slate-700", "gray-700"),
    ("slate-600", "gray-600"),
    ("slate-500", "gray-500"),
    ("slate-400", "gray-400"),
    ("slate-300", "gray-300"),
    ("slate-200", "gray-200"),
    ("slate-100", "gray-100"),
    ("slate-50", "gray-50"),
    # Blue específicos com opacidade
    ("bg-blue-500/10", "bg-red-500/10"),
    ("bg-blue-500/20", "bg-red-500/20"),
    ("bg-blue-600/10", "bg-red-600/10"),
    ("bg-blue-600/20", "bg-red-600/20"),
    ("bg-blue-400/20", "bg-red-400/20"),
    ("border-blue-500/20", "border-red-500/20"),
    ("border-blue-500/30", "border-red-500/30"),
    ("border-blue-400/30", "border-red-400/30"),
    ("border-blue-300/30", "border-red-300/30"),
    ("shadow-blue-500/10", "shadow-red-500/10"),
    ("shadow-blue-500/20", "shadow-red-500/20"),
    ("shadow-blue-500/25", "shadow-red-500/25"),
    ("shadow-blue-500/30", "shadow-red-500/30"),
    ("shadow-blue-600/25", "shadow-red-600/25"),
    ("shadow-blue-600/30", "shadow-red-600/30"),
    ("hover:border-blue-500/50", "hover:border-red-500/50"),
    # Blue bg
    ("bg-blue-950", "bg-gray-950"),
    ("bg-blue-900", "bg-gray-900"),
    ("bg-blue-800", "bg-red-900"),
    ("bg-blue-700", "bg-red-700"),
    ("bg-blue-600", "bg-red-600"),
    ("bg-blue-500", "bg-red-500"),
    ("bg-blue-100", "bg-red-100"),
    ("bg-blue-50", "bg-red-50"),
    # Blue text
    ("text-blue-950", "text-gray-950"),
    ("text-blue-900", "text-red-700"),
    ("text-blue-800", "text-red-700"),
    ("text-blue-700", "text-red-600"),
    ("text-blue-600", "text-red-600"),
    ("text-blue-500", "text-red-500"),
    ("text-blue-400", "text-red-400"),
    ("text-blue-300", "text-red-300"),
    ("text-blue-200", "text-red-200"),
    ("text-blue-100", "text-gray-100"),
    # Cyan text
    ("text-cyan-400", "text-red-400"),
    ("text-cyan-500", "text-red-500"),
    ("text-cyan-300", "text-red-300"),
    # Blue border
    ("border-blue-900", "border-red-800"),
    ("border-blue-800", "border-red-800"),
    ("border-blue-700", "border-red-700"),
    ("border-blue-600", "border-red-600"),
    ("border-blue-500", "border-red-500"),
    ("border-blue-200", "border-red-200"),
    # Blue hover
    ("hover:bg-blue-900", "hover:bg-gray-900"),
    ("hover:bg-blue-800", "hover:bg-red-800"),
    ("hover:bg-blue-700", "hover:bg-red-700"),
    ("hover:bg-blue-600", "hover:bg-red-600"),
    ("hover:bg-blue-50", "hover:bg-red-50"),
    ("hover:text-blue-900", "hover:text-red-700"),
    ("hover:text-blue-800", "hover:text-red-700"),
    ("hover:text-blue-600", "hover:text-red-600"),
    ("hover:text-blue-400", "hover:text-red-400"),
    ("hover:text-blue-300", "hover:text-red-300"),
    ("hover:border-blue-500", "hover:border-red-500"),
    # Focus / ring
    ("focus:ring-blue-500", "focus:ring-red-500"),
    ("focus:border-blue-500", "focus:border-red-500"),
    ("ring-blue-500", "ring-red-500"),
    # data-state active
    ('data-[state=active]:bg-blue-600', 'data-[state=active]:bg-red-600'),
    ('data-[state=active]:text-blue-600', 'data-[state=active]:text-red-600'),
    ("checked:bg-blue-600", "checked:bg-red-600"),
    # from/to/via blue
    ("from-blue-950", "from-gray-950"),
    ("from-blue-900", "from-gray-900"),
    ("from-blue-800", "from-red-900"),
    ("from-blue-600", "from-red-600"),
    ("from-blue-500", "from-red-500"),
    ("to-blue-950", "to-gray-950"),
    ("to-blue-900", "to-gray-900"),
    ("to-blue-800", "to-gray-900"),
    ("to-blue-600", "to-red-600"),
    ("to-blue-500", "to-red-500"),
    ("to-cyan-400", "to-red-400"),
    ("to-cyan-500", "to-red-500"),
    ("to-cyan-600", "to-red-600"),
    ("from-cyan-400", "from-red-400"),
    ("from-cyan-500", "from-red-500"),
    ("from-cyan-600", "from-red-600"),
    ("via-blue-950", "via-gray-950"),
    ("via-blue-900", "via-gray-900"),
    ("via-blue-600", "via-red-600"),
    ("via-indigo-900", "via-red-950"),
    ("via-indigo-600", "via-red-600"),
    # Indigo
    ("bg-indigo-900", "bg-gray-900"),
    ("bg-indigo-800", "bg-red-900"),
    ("bg-indigo-600", "bg-red-600"),
    ("bg-indigo-500", "bg-red-500"),
    ("bg-indigo-100", "bg-red-100"),
    ("bg-indigo-50", "bg-red-50"),
    ("text-indigo-900", "text-red-700"),
    ("text-indigo-600", "text-red-600"),
    ("text-indigo-400", "text-red-400"),
    ("border-indigo-600", "border-red-600"),
    ("hover:bg-indigo-700", "hover:bg-red-700"),
    ("from-indigo-900", "from-gray-900"),
    ("from-indigo-600", "from-red-600"),
    ("to-indigo-900", "to-gray-900"),
    ("to-indigo-600", "to-red-600"),
    ("to-indigo-700", "to-red-700"),
    # Violet / purple
    ("bg-violet-600", "bg-red-600"),
    ("bg-purple-600", "bg-red-600"),
    ("bg-purple-100", "bg-red-100"),
    ("text-violet-600", "text-red-600"),
    ("text-purple-600", "text-red-600"),
    ("from-violet-600", "from-red-600"),
    ("from-purple-600", "from-red-600"),
    ("to-violet-600", "to-red-600"),
    ("to-purple-600", "to-red-600"),
    # Nome da empresa
    ("Nacional Veículos", "GT Veículos"),
    ("Nacional Veiculos", "GT Veículos"),
    ("nacional veículos", "gt veículos"),
    ("nacional veiculos", "gt veículos"),
    ("@nacionalveiculos.com.br", "@gtveiculos.com.br"),
    ("nacionalveiculos.com.br", "gtveiculos.com.br"),
]

# Descobre o root do projeto
import sys
root_dir = "/vercel/share/v0-project"
# Fallback: tenta via sys.path
if not os.path.exists(root_dir):
    root_dir = os.path.abspath(os.path.join(os.getcwd(), ".."))
print(f"[v0] root_dir: {root_dir}")
print(f"[v0] root_dir exists: {os.path.exists(root_dir)}")

total_files = 0
total_subs = 0

for rel_path in TARGET_FILES:
    full_path = os.path.join(root_dir, rel_path)
    if not os.path.exists(full_path):
        print(f"[v0] SKIP (nao encontrado): {rel_path}")
        continue

    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    count = 0
    for (old, new) in REPLACEMENTS:
        n = content.count(old)
        if n > 0:
            content = content.replace(old, new)
            count += n

    if content != original:
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        total_files += 1
        total_subs += count
        print(f"[v0] OK: {rel_path} ({count} subs)")

print(f"\n[v0] CONCLUIDO: {total_files} arquivo(s) | {total_subs} substituicao(oes)")
