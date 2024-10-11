import React from 'react';
import { useState } from 'react';
import prefectures from './japan.json';
import styles from './JapanMap.module.css';

interface PrefectureDescription {
  id: string;
  description: string;
  fill: string;
}

interface JapanMapProps {
  lang?: 'en' | 'ja';
  strokeColor?: string;
  strokeWidth?: string;
  hoverColor?: string;
  bgColor?: string;
  size?: string;
  data?: PrefectureDescription[];
}

const JapanMap: React.FC<JapanMapProps> = ({
  lang = 'ja',
  strokeColor = '#000',
  strokeWidth = '0.5',
  hoverColor = '#E0E0E0',
  bgColor,
  size = '600px',
  data = [],
}) => {
  const [hoveredPrefecture, setHoveredPrefecture] = useState<string | null>(
    null
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent<SVGPathElement>) => {
    const target = e.currentTarget as SVGPathElement;

    const id = target.getAttribute('data-id');
    const name = target.getAttribute('data-name');
    setHoveredPrefecture(name || null);
    setHoveredId(id || null);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setHoveredPrefecture(null);
    setHoveredId(null);
  };

  const getDescription = (id: string) => {
    const prefectureDesc = data.find((desc) => desc.id === id);
    return prefectureDesc ? prefectureDesc.description : '';
  };

  const getFill = (id: string, defaultFill: string) => {
    const prefectureDesc = data.find((desc) => desc.id === id);
    const fillColor =
      prefectureDesc && prefectureDesc.fill ? prefectureDesc.fill : defaultFill;
    return hoveredId === id ? hoverColor : fillColor;
  };

  return (
    <div
      className={styles.mapContainer}
      style={{ width: size, backgroundColor: bgColor }}
    >
      {hoveredPrefecture && (
        <div
          className={styles.tooltip}
          style={{
            top: tooltipPosition.y + 20,
            left: tooltipPosition.x + 50,
            position: 'fixed',
          }}
        >
          {hoveredPrefecture}
          <div style={{ whiteSpace: 'pre-line' }}>
            {hoveredId ? getDescription(hoveredId) : ''}
          </div>
        </div>
      )}
      <svg
        viewBox="200 0 600 650"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.map}
        onMouseMove={handleMouseMove}
      >
        <g id="features">
          {prefectures.map(({ id, name, fill, kanji, path }) => (
            <path
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              key={id}
              d={path}
              data-name={lang === 'en' ? name : kanji}
              data-id={id}
              fill={getFill(id, fill)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ))}

          <path
            style={{
              stroke: 'rgb(0, 0, 0)',
              strokeWidth: '1px',
              fill: 'rgba(216, 216, 216, 0)',
            }}
            d="M 542.333 615.672 L 543.044 538.402 L 764.61 395.967 C 764.61 395.967 855.526 396.165 855.176 396.165"
          ></path>
        </g>
      </svg>
    </div>
  );
};

export default JapanMap;
