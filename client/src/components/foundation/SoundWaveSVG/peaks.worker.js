import _ from 'lodash';
import * as comlink from 'comlink';

/**
 * @param {Float32Array[]} channelData
 * @returns {{ max: number, peaks: number[] }}
 */
export function calcPeaks(channelData) {
  // 左の音声データの絶対値を取る
  const leftData = _.map(channelData[0], Math.abs);
  // 右の音声データの絶対値を取る
  const rightData = _.map(channelData[1], Math.abs);

  // 左右の音声データの平均を取る
  const normalized = _.map(_.zip(leftData, rightData), _.mean);
  // 100 個の chunk に分ける
  const chunks = _.chunk(normalized, Math.ceil(normalized.length / 100));
  // chunk ごとに平均を取る
  const peaks = _.map(chunks, _.mean);
  // chunk の平均の中から最大値を取る
  const max = _.max(peaks);

  return { max, peaks };
}

comlink.expose({
  calcPeaks,
});
