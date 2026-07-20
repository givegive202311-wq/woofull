# SVG図解の作り方（完全無料）

記事用の図解（手順フロー・比較図など）をSVGで自作し、PNGに変換して`public/images/diagrams/`に置く手順。
画像生成AIを使わないので費用は一切かからない。

## デザインルール

- 背景：クリーム `#FFF8F1`
- アクセント：ブランドオレンジ `#F6A54B`
- 文字：ダーク `#2D2D2D`
- 見出し・数字などの強調文字は丸ゴシック体 `'Arial Rounded MT Bold'`（サイトの雰囲気に合わせる。macOSに標準搭載）
- 本文寄りの文字は `'Hiragino Sans'`
- 1枚に詰め込みすぎない。手順なら3〜5ステップ、比較なら2〜3項目まで

## PNG変換手順（macOSのqlmanageを使う。追加インストール不要）

**注意**：`qlmanage`はSVGを正方形キャンバスに強制変換する癖がある。正方形のSVGならそのまま使えるが、横長・縦長のSVGはこの手順を踏まないと内容が切れる。

1. SVGは正方形キャンバス（例：1200×1200）で作り、実際に見せたい内容は`<g transform="translate(0, 余白の半分)">`で縦方向の中央に寄せておく
2. 変換する：
   ```
   qlmanage -t -s 1200 -o . ファイル名.svg
   ```
   → `ファイル名.svg.png`が1200×1200の正方形で生成される
3. 中央を必要なサイズに切り出す：
   ```
   sips -c 640 1200 ファイル名.svg.png --out ファイル名.png
   ```
   （`-c 高さ 幅`。切り出しは画像の中央基準）
4. 一時ファイルを削除：`rm -f ファイル名.svg.png`

## 中央揃えの確認（目視で判断しない）

Finderのプレビューやqlmanageのサムネイルは余計な枠や余白が付いて見えることがあるため、**必ずPythonで実ピクセルを測定して確認する**。

```python
from PIL import Image
im = Image.open('ファイル名.png').convert('RGB')
w, h = im.size
px = im.load()
target = (246,165,75)  # ブランドオレンジ。他の色を測る場合は変更
def close(c, t, tol=40):
    return all(abs(c[i]-t[i]) <= tol for i in range(3))
minx,miny,maxx,maxy = w,h,0,0
for y in range(0,h,2):
    for x in range(0,w,2):
        if close(px[x,y], target):
            minx=min(minx,x); maxx=max(maxx,x)
            miny=min(miny,y); maxy=max(maxy,y)
print('bbox', minx, miny, maxx, maxy)
print('center', (minx+maxx)/2, (miny+maxy)/2, 'target', w/2, h/2)
```

薄い透明度の装飾（背景の丸模様など）は本体と誤検出しやすいので、`target`には必ず主役の色（ロゴのオレンジ、本文の文字色など）を指定する。装飾円のような薄い色を拾ってしまうと、常に同じ数値が返り「変更したのに measurement が変わらない」という混乱が起きる（実際に起きた失敗）。

## 記事への組み込み方

`src/lib/articles.ts`の該当記事の`body`内に、Markdown画像記法で挿入する。

```
![altテキスト](/images/diagrams/ファイル名.png)
```

`public/images/diagrams/xxx.png` → コード上のパスは `/images/diagrams/xxx.png`（`public`は省略）。
