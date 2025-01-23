# 批量压缩 ../readme/*.png 图片
# 依赖: pngquant
# 安装: brew install pngquant

import os
import shutil
import subprocess

# 压缩图片
def compress_image(src, dst):
  print('compressing', src)
  subprocess.run(['pngquant', src, '--output', dst])

# 遍历 ../readme 目录下的所有 png 图片
for file in os.listdir('readme'):
  if file.endswith('.png'):
    src = 'readme/' + file
    dst = 'readme/' + file.replace('.png', '-min.png')
    compress_image(src, dst)
    os.remove(src)
    shutil.move(dst, src)

print('done')
  