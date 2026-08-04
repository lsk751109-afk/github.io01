import './globals.css';

export const metadata = {
  title: '케어택 | 간병 전문 매칭 플랫폼',
  description: '검증된 간병인을 비교하고 선택하는 케어택 간병 매칭 플랫폼'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
