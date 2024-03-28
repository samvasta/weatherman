import React from "react";

import {
  Annotation,
  CircleSubject,
  Connector,
  HtmlLabel,
} from "@visx/annotation";
import { Axis } from "@visx/axis";
import { RectClipPath } from "@visx/clip-path";
import { localPoint } from "@visx/event";
import { GridColumns, GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { useParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { Area, LinePath } from "@visx/shape";
import { Text } from "@visx/text";

import { Txt } from "@/components/primitives/text/Text";

import { type Percentiles, type Serie } from "@/types/results";
import { formatNumber } from "@/utils/numberFormat";

export type RiverChartData = {
  percentiles: Percentiles[];
  series: Serie[];
  baseColor: string;
};

export type RiverChartProps = {
  data: RiverChartData;
  name: string;
  type: "river" | "hair";
};

export function RiverChart({ data, name, type }: RiverChartProps) {
  const { parentRef, width, height } = useParentSize({ debounceTime: 150 });
  const margin = { top: 48, right: 32, bottom: 48, left: 80 };

  // bounds
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  // scales
  const xScale = scaleLinear<number>({
    range: [0, xMax],
    domain: [1, data.percentiles.length],
  });
  const yScale = scaleLinear<number>({
    range: [0, yMax],
    // Go in opposite order so big numbers are on top
    domain: [
      maxByKey(data.percentiles, "p100"),
      minByKey(data.percentiles, "p00"),
    ],
  });

  const points = React.useMemo(
    () =>
      data.percentiles.map((s, i) => ({
        ...s,
        x: i + 1,
      })),
    [data.percentiles]
  );

  const [tooltipData, setTooltipData] = React.useState<
    (Percentiles & { x: number }) | null
  >(null);

  const handleTooltip = React.useCallback(
    (event: React.MouseEvent<SVGRectElement>) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const point = localPoint(event);

      if (!point) {
        return;
      }

      const x0 = xScale.invert(point.x - margin.left);
      const data = points.find((p) => p.x === Math.round(x0));
      if (!data) {
        return;
      }
      setTooltipData(data);
    },
    [xScale, points, margin.left, setTooltipData]
  );

  const tooltips = React.useMemo(() => {
    if (!tooltipData) {
      return [];
    }

    const x = xScale(tooltipData.x);
    const dx = tooltipData.x > points.length / 2 ? -100 : 100;

    let minY = yScale(tooltipData.p50);
    let maxY = minY + 24;

    const tooltips = [
      {
        value: tooltipData.p50,
        percentile: 50,
        y: minY,
        x,
        dy: 0,
        dx,
      },
    ];

    for (const dat of [
      [tooltipData.p25, 25],
      [tooltipData.p75, 75],
      [tooltipData.p10, 10],
      [tooltipData.p90, 90],
      [tooltipData.p05, 5],
      [tooltipData.p95, 95],
      [tooltipData.p00, 0],
      [tooltipData.p100, 100],
    ]) {
      const [point, percentile] = dat as [number, number];
      const y = yScale(point);
      let dy = 0;
      if (point < tooltipData.p50) {
        dy = Math.max(y, maxY + 24);
      } else if (point > tooltipData.p50) {
        dy = Math.min(y, minY - 24);
      }

      minY = Math.min(dy, minY);
      maxY = Math.max(dy, maxY);

      tooltips.push({
        value: point,
        percentile,
        y,
        x,
        dy: dy - y,
        dx,
      });
    }

    while (minY < 16) {
      tooltips.forEach((t) => {
        if (t.y + t.dy < yMax / 3) {
          t.dy += 2;

          if (t.dx < 0) {
            t.dx -= 2;
          } else {
            t.dx += 2;
          }
        }
      });

      minY = Number.POSITIVE_INFINITY;
      tooltips.forEach((t) => {
        minY = Math.min(t.y + t.dy, minY);
      });
    }

    while (maxY > height - 128) {
      tooltips.forEach((t) => {
        if (t.y + t.dy > yMax / 3) {
          t.dy -= 16;

          if (t.dx < 0) {
            t.dx -= 16;
          } else {
            t.dx += 16;
          }
        }
      });

      maxY = 0;
      tooltips.forEach((t) => {
        maxY = Math.max(t.y + t.dy, maxY);
      });
    }

    return tooltips;
  }, [tooltipData, xScale, yScale, points.length, height, yMax]);

  return (
    <div ref={parentRef} className="h-full w-full">
      <svg width={width} height={height}>
        <Text textAnchor="middle" fontSize={24} x={width / 2} y={32}>
          {`${name} vs time`}
        </Text>

        <Group
          transform={`translate(${margin.left},${margin.top})`}
          overflow="clip"
        >
          <RectClipPath id="chart-area" width={xMax} height={yMax} />
          <GridRows
            scale={yScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <GridColumns
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
            numTicks={points.length}
          />

          <Axis
            orientation="bottom"
            top={yMax}
            scale={xScale}
            numTicks={points.length}
            tickValues={points.map((p) => p.x)}
            tickLabelProps={{
              transform: "translate(0,10)",
              fontSize: "12px",
              fontFamily: "Azeret Mono",
            }}
          />
          <Axis
            orientation="left"
            scale={yScale}
            tickFormat={(v) => formatNumber(Number(v))}
            tickLabelProps={{
              transform: "translate(-24,4)",
              fontSize: "12px",
              fontFamily: "Azeret Mono",
            }}
          />
          <Area
            x={(d) => xScale(d.x)}
            y0={(d) => yScale(d.p00)}
            y1={(d) => yScale(d.p100)}
            fill={type === "river" ? `#c8f50033` : "transparent"}
            data={points}
            clipPath="url(#chart-area)"
            onMouseMove={handleTooltip}
            onMouseOut={() => setTooltipData(null)}
          />
          {type === "river" ? (
            <>
              <Area
                x={(d) => xScale(d.x)}
                y0={(d) => yScale(d.p05)}
                y1={(d) => yScale(d.p95)}
                data={points}
                fill={`#84da4388`}
                clipPath="url(#chart-area)"
                pointerEvents="none"
              />
              <Area
                x={(d) => xScale(d.x)}
                y0={(d) => yScale(d.p10)}
                y1={(d) => yScale(d.p90)}
                data={points}
                fill={`#4ebc5cBB`}
                clipPath="url(#chart-area)"
                pointerEvents="none"
              />
              <Area
                x={(d) => xScale(d.x)}
                y0={(d) => yScale(d.p25)}
                y1={(d) => yScale(d.p75)}
                data={points}
                fill={`#2c9b67`}
                clipPath="url(#chart-area)"
                pointerEvents="none"
              />
              <LinePath
                data={points}
                x={(d) => xScale(d.x)}
                y={(d) => yScale(d.p50)}
                stroke="#193b2d"
                strokeWidth={4}
                shapeRendering="geometricPrecision"
                clipPath="url(#chart-area)"
                pointerEvents="none"
              />
            </>
          ) : (
            <>
              {data.series.map((s, i) => (
                <LinePath
                  key={i}
                  data={s}
                  x={(_, i) => xScale(i + 1) ?? 0}
                  y={(d) => yScale(d) ?? 0}
                  stroke="#193b2d44"
                  strokeWidth={2}
                  shapeRendering="geometricPrecision"
                  clipPath="url(#chart-area)"
                  pointerEvents="none"
                />
              ))}
            </>
          )}
          {tooltipData && (
            <>
              {tooltips.map((data) => (
                <Annotation
                  key={data.percentile}
                  x={data.x}
                  y={data.y}
                  dx={data.dx}
                  dy={data.dy}
                >
                  <Connector stroke="#333" type="elbow" className="z-40" />
                  <HtmlLabel
                    containerStyle={{
                      zIndex: 500,
                      width: "max-content",
                      textAlign: data.dx > 0 ? "start" : "end",
                      paddingInline: "1rem",
                      background: "var(--current-color-1)",
                    }}
                  >
                    <Txt as="span" className="font-mono font-bold">
                      {formatNumber(data.value)}{" "}
                      <Txt as="span" intent="subtle" className="font-normal">
                        {data.percentile === 100
                          ? "(Maximum)"
                          : data.percentile === 0
                            ? "(Minimum)"
                            : `(${data.percentile}th Percentile)`}
                      </Txt>
                    </Txt>
                  </HtmlLabel>
                  <CircleSubject radius={5} fill="#333" />
                </Annotation>
              ))}
            </>
          )}
        </Group>
      </svg>
    </div>
  );
}

function minByKey<T>(arr: T[], key: keyof T): number {
  return arr.reduce((min, i) => {
    return Math.min(min, i[key] as number);
  }, Number.POSITIVE_INFINITY);
}

function maxByKey<T>(arr: T[], key: keyof T): number {
  return arr.reduce((min, i) => {
    return Math.max(min, i[key] as number);
  }, Number.NEGATIVE_INFINITY);
}
