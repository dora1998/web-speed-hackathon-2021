import _ from 'lodash';
import React from 'react';
import * as comlink from 'comlink';
import PeaksWorker from './peaks.worker';

/**
 * @typedef {object} Props
 * @property {ArrayBuffer} soundData
 */

/**
 * @type {React.VFC<Props>}
 */
const SoundWaveSVG = ({ soundData }) => {
  const uniqueIdRef = React.useRef(Math.random().toString(16));
  const [{ max, peaks }, setPeaks] = React.useState({ max: 0, peaks: [] });

  React.useEffect(async () => {
    const audioCtx = new AudioContext();

    // 音声をデコードする
    /** @type {AudioBuffer} */
    const buffer = await new Promise((resolve, reject) => {
      audioCtx.decodeAudioData(soundData.slice(0), resolve, reject);
    });
    const channelData = [buffer.getChannelData(0), buffer.getChannelData(1)];

    if (window.Worker) {
      const worker = comlink.wrap(new PeaksWorker());
      const { max, peaks } = await worker.calcPeaks(channelData);
      console.log(max, peaks);
      setPeaks({ max, peaks });
      return;
    }

    const { max, peaks } = PeaksWorker.calcPeaks(channelData);
    setPeaks({ max, peaks });
  }, [soundData]);

  return (
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {peaks.map((peak, idx) => {
        const ratio = peak / max;
        return (
          <rect
            key={`${uniqueIdRef.current}#${idx}`}
            fill="#2563EB"
            height={ratio}
            stroke="#EFF6FF"
            strokeWidth="0.01"
            width="1"
            x={idx}
            y={1 - ratio}
          />
        );
      })}
    </svg>
  );
};

export { SoundWaveSVG };
