/**
 * 查询
 *
 * @author 张卓诚
 * @export
 * @interface BiQuery
 */
export interface BiQuery {
  processes: Process[];
}

/**
 * 处理管道
 *
 * @author 张卓诚
 * @export
 * @interface Pip
 */
export interface Pip {
  type: "transform" | "merge" | "filter" | "attach" | "filterByProperty";
  inputs: Data[];
  outputs: Data;
}

/**
 * 变形
 *
 * @author 张卓诚
 * @export
 * @interface Transform
 * @extends {Pip}
 */
export interface Transform extends Pip {
  type: "transform";
  inputs: [Data];
  /**
   * 只在 `inputs` 是 `[PointData]` 时有效
   *
   * @type {Shape}
   * @memberof Transform
   */
  toShape: Shape;
  /**
   * 目标图形的直径
   * 数字时，是固定值
   * 字符时，指的时愿数据的属性
   *
   * @type {(number | string)}
   * @memberof Transform
   */
  toShapeDiameter: number | string;
  /**
   * 目标图形缩放系数
   *
   * @type {number}
   * @memberof Transform
   */
  toShapeScale: number;
  /**
   * 目标图形朝向
   * 角度值或者`"random"`
   *
   * @example 360
   * @type {(number | "random")}
   * @memberof Transform
   */
  toShapeRotate: number | "random";

  /**
   * 只在`toShape`为`"point"`时有效
   *
   * @type {number}
   * @memberof Transform
   */
  toShapeMethod: "geometricCenter" | "governmentCentre";
  outputs: Data;
}

/**
 * 合并属性
 *
 * @author 张卓诚
 * @export
 * @interface Merge
 * @extends {Pip}
 */
export interface Merge extends Pip {
  type: "merge";
  conditions: Relation[];
  merge: {
    property: Calculation;
  };
  inputs: [Data, Data];
  outputs: Data;
}

export interface Attach extends Pip {
  type: "attach";
  attach: {
    property: MathExpr;
  };
  inputs: [Data];
  outputs: Data;
}

export interface Filter extends Pip {
  type: "filter";
  filter: Relation[];
  inputs: [Data, Data];
  outputs: Data;
}

export interface FilterByProperty extends Pip {
  type: "filterByProperty";
  filterByProperty: MathExpr;
  inputs: [Data, Data];
  outputs: Data;
}

/**
 * 处理流程
 *
 * @author 张卓诚
 * @export
 * @interface Process
 */
export interface Process {
  inputs: Data[];
  pip: Pip;
}

export interface Data {
  id: string;
  type: "multiPoint" | "multiPolygon" | "multiLineString" | "raster";
  stage: "origin" | "middle" | "final";
  origin: string;
}

export interface MultiPointData extends Data {
  type: "multiPoint";
}

export interface MultiPolygonData extends Data {
  type: "multiPolygon";
}

export interface MultiLineStringData extends Data {
  type: "multiLineString";
}

export interface RasterData extends Data {
  type: "raster";
}

type Relation = "intersect" | "notIntersect" | "contains" | "contained";

type Calculation = "sum" | "average" | "maximum" | "minimum" | "median" | "concat";

type Shape = "circle" | "triangle" | "square" | "point" | "raster";

/**
 * 数学表达式
 * 内容中非数字符号一律作为属性名处理
 * @example property + 12 * 1
 */
type MathExpr = string;
