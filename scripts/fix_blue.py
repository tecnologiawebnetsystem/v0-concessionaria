import os, re

root = "/vercel/share/v0-project"
print(f"[v0] root exists: {os.path.exists(root)}")

# Substituições Tailwind: azul/ciano/indigo/violeta/roxo → vermelho/cinza
REPLACEMENTS = [
    # gradients
    (r'from-blue-(\d+)', r'from-red-\1'),
    (r'to-blue-(\d+)', r'to-red-\1'),
    (r'via-blue-(\d+)', r'via-red-\1'),
    (r'from-cyan-(\d+)', r'from-red-\1'),
    (r'to-cyan-(\d+)', r'to-red-\1'),
    (r'via-cyan-(\d+)', r'via-red-\1'),
    (r'from-indigo-(\d+)', r'from-red-\1'),
    (r'to-indigo-(\d+)', r'to-red-\1'),
    (r'via-indigo-(\d+)', r'via-red-\1'),
    (r'from-violet-(\d+)', r'from-red-\1'),
    (r'to-violet-(\d+)', r'to-red-\1'),
    (r'via-violet-(\d+)', r'via-red-\1'),
    (r'from-purple-(\d+)', r'from-red-\1'),
    (r'to-purple-(\d+)', r'to-red-\1'),
    (r'via-purple-(\d+)', r'via-red-\1'),
    # backgrounds
    (r'bg-blue-(\d+)', r'bg-red-\1'),
    (r'bg-cyan-(\d+)', r'bg-red-\1'),
    (r'bg-indigo-(\d+)', r'bg-red-\1'),
    (r'bg-violet-(\d+)', r'bg-red-\1'),
    (r'bg-purple-(\d+)', r'bg-red-\1'),
    # text
    (r'text-blue-(\d+)', r'text-red-\1'),
    (r'text-cyan-(\d+)', r'text-gray-\1'),
    (r'text-indigo-(\d+)', r'text-red-\1'),
    (r'text-violet-(\d+)', r'text-red-\1'),
    (r'text-purple-(\d+)', r'text-red-\1'),
    # borders
    (r'border-blue-(\d+)', r'border-red-\1'),
    (r'border-cyan-(\d+)', r'border-red-\1'),
    (r'border-indigo-(\d+)', r'border-red-\1'),
    (r'border-violet-(\d+)', r'border-red-\1'),
    (r'border-purple-(\d+)', r'border-red-\1'),
    # ring
    (r'ring-blue-(\d+)', r'ring-red-\1'),
    (r'ring-cyan-(\d+)', r'ring-red-\1'),
    (r'ring-indigo-(\d+)', r'ring-red-\1'),
    (r'ring-violet-(\d+)', r'ring-red-\1'),
    (r'ring-purple-(\d+)', r'ring-red-\1'),
    # shadow
    (r'shadow-blue-(\d+)', r'shadow-red-\1'),
    (r'shadow-cyan-(\d+)', r'shadow-red-\1'),
    (r'shadow-indigo-(\d+)', r'shadow-red-\1'),
    (r'shadow-violet-(\d+)', r'shadow-red-\1'),
    (r'shadow-purple-(\d+)', r'shadow-red-\1'),
    # hover, focus, data variants
    (r'hover:bg-blue-(\d+)', r'hover:bg-red-\1'),
    (r'hover:bg-cyan-(\d+)', r'hover:bg-red-\1'),
    (r'hover:bg-indigo-(\d+)', r'hover:bg-red-\1'),
    (r'hover:bg-violet-(\d+)', r'hover:bg-red-\1'),
    (r'hover:bg-purple-(\d+)', r'hover:bg-red-\1'),
    (r'hover:text-blue-(\d+)', r'hover:text-red-\1'),
    (r'hover:text-cyan-(\d+)', r'hover:text-red-\1'),
    (r'hover:text-indigo-(\d+)', r'hover:text-red-\1'),
    (r'hover:text-violet-(\d+)', r'hover:text-red-\1'),
    (r'hover:text-purple-(\d+)', r'hover:text-red-\1'),
    (r'hover:border-blue-(\d+)', r'hover:border-red-\1'),
    (r'hover:border-cyan-(\d+)', r'hover:border-red-\1'),
    (r'focus:border-blue-(\d+)', r'focus:border-red-\1'),
    (r'focus:ring-blue-(\d+)', r'focus:ring-red-\1'),
    (r'focus:ring-cyan-(\d+)', r'focus:ring-red-\1'),
    # data state
    (r'data-\[state=active\]:bg-blue-(\d+)', r'data-[state=active]:bg-red-\1'),
    (r'data-\[state=active\]:text-blue-(\d+)', r'data-[state=active]:text-red-\1'),
]

compiled = [(re.compile(pat), repl) for pat, repl in REPLACEMENTS]

changed = 0
for dirpath, dirnames, filenames in os.walk(root):
    # skip node_modules, .next, .git, scripts
    dirnames[:] = [d for d in dirnames if d not in ('node_modules', '.next', '.git', 'scripts', 'ui')]
    for fname in filenames:
        if not (fname.endswith('.tsx') or fname.endswith('.ts') or fname.endswith('.css')):
            continue
        fpath = os.path.join(dirpath, fname)
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception:
            continue
        new_content = content
        for pat, repl in compiled:
            new_content = pat.sub(repl, new_content)
        if new_content != content:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            rel = fpath.replace(root + '/', '')
            print(f"[v0] updated: {rel}")
            changed += 1

print(f"[v0] total files changed: {changed}")
