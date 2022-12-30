export function getDateTime() {
  const date = new Date();
  const Week = ["日", "一", "二", "三", "四", "五", "六"];
  const dateTime = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()} 星期${
    Week[date.getDay()]
  }`;
  return dateTime;
}

export function getShowDate(dateTime: string): string {
  if (dateTime === "") {
    return "";
  }
  const now = new Date();
  const Week = ["日", "一", "二", "三", "四", "五", "六"];
  const year = now.getFullYear(); //年
  const month = now.getMonth() + 1; //月
  const day = now.getDate(); //日

  const hh = now.getHours(); //时
  const mm = now.getMinutes(); //分
  const ms = now.getMilliseconds();
  const wk = Week[now.getDay()];

  const array = dateTime.split(" ");
  const arrat2 = array[1].split(".")[0];
  // 数据库时间
  const td: Date = convertDateFromString(array[0] + " " + arrat2);

  // 现在时间
  const nowdt = parseInt(year.toString() + month.toString() + day.toString());
  const olddt = parseInt(
    td.getFullYear().toString() +
      (td.getMonth() + 1).toString() +
      td.getDate().toString()
  );
  // 日期大，小于7显示wek，大于现实全部
  if (nowdt > olddt) {
    if (nowdt - olddt > 7) {
      // yy-mm-dd
      return (
        td.getFullYear().toString().substring(2, 4) +
        "-" +
        (td.getMonth() + 1).toString() +
        "-" +
        td.getDate().toString()
      );
    } else {
      // 昨天hh-mu
      if (nowdt - olddt === 1) {
        return "昨天" + td.getHours() + ":" + td.getMinutes();
      } else {
        return Week[td.getDay()];
      }
    }
  }
  // 日期相等，小于1h显示hh:mm
  else if (nowdt === olddt) {
    // const oldHour = td.getHours()
    // if(oldHour - hh >1)
    return td.getHours() + ":" + td.getMinutes();
  }
  return "";
}

function compTime(beginTime: string, endTime: string) {
  const beginTimes = beginTime.substring(0, 10).split("-");
  const endTimes = endTime.substring(0, 10).split("-");

  beginTime =
    beginTimes[1] +
    "-" +
    beginTimes[2] +
    "-" +
    beginTimes[0] +
    " " +
    beginTime.substring(10, 19);
  endTime =
    endTimes[1] +
    "-" +
    endTimes[2] +
    "-" +
    endTimes[0] +
    " " +
    endTime.substring(10, 19);

  alert(beginTime + "aaa" + endTime);
  alert(Date.parse(endTime));
  alert(Date.parse(beginTime));
  const a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
  if (a < 0) {
    alert("endTime小!");
  } else if (a > 0) {
    alert("endTime大!");
  } else if (a == 0) {
    alert("时间相等!");
  } else {
    return "exception";
  }
}

function CurentTime() {
  const now = new Date();

  const year = now.getFullYear(); //年
  const month = now.getMonth() + 1; //月
  const day = now.getDate(); //日

  const hh = now.getHours(); //时
  const mm = now.getMinutes(); //分
  const ms = now.getMilliseconds();

  let clock = year + "-";

  if (month < 10) clock += "0";

  clock += month + "-";

  if (day < 10) clock += "0";

  clock += day + " ";

  if (hh < 10) clock += "0";

  clock += hh + ":";
  if (mm < 10) clock += "0";
  clock += mm;
  clock += ms;
  return clock;
}

function convertDateFromString(dateString: string): Date {
  const arr1 = dateString.split(" ");
  // const arr2 = arr1[1].split(".");
  const sdate = arr1[0].split("-");
  const time = arr1[1].split(":");
  const date = new Date(
    parseInt(sdate[0]),
    parseInt(sdate[1]) - 1,
    parseInt(sdate[2]),
    parseInt(time[0]),
    parseInt(time[1]),
    parseInt(time[2])
  );
  return date;
}
