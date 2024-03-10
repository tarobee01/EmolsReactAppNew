import React from 'react';

const SetScreen = ({ eventData, setEventData }) => {
  return (
    <div>
      <style>
        {`
          .description {
            margin-bottom: 20px;
          }

          .features {
            margin-top: 20px;
          }

          .features h3 {
            margin-bottom: 10px;
          }

          h2 {
            margin-left: 10px; /* 左に余白を追加 */
          }
        `}
      </style>
      <div className="description">
        <h2>説明</h2>
        <ol>
          <li>パレットから色を選択します。</li>
          <li>日付と時間を指定して加えるボタンを押します。</li>
          <li>予定のある日付を押すと詳細に移動できます。</li>
        </ol>
      </div>
      <div className="features">
        <h2>特徴</h2>
        <ol>
          <li>予定の色によってカレンダーの色が変化します。混色も可能です。</li>
          <li>予定が入っている場合、その予定と被らない時間が自動的に設定されます。</li>
          <li>常にデータベースへ保存がされています。</li>
          <li>すべての予定を削除すると、カレンダーの画面に移動します。</li>
        </ol>
      </div>
    </div>
  );
};

export default SetScreen;
