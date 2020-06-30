import React from "react";
import { Badge } from "reactstrap";
import { Link } from "react-router-dom";
import fuFormatter from "components/utils/dateFormatter";

const Item = ({ item, ikey }) => {
  if (ikey == "offer_id") {
    return (
      <td className="text-center">
        <Link to={`/admin/offers/${item[ikey]}`}>{item[ikey]}</Link>
      </td>
    );
  } else if (ikey == "user_id") {
    return (
      <td className="text-center">
        <Link to={`/admin/users/${item[ikey]}`}>{item[ikey]}</Link>
      </td>
    );
  } else if (ikey == "pay_report_id") {
    return (
      <td className="text-center">
        <Link to={`/admin/pay_reports/${item[ikey]}`}>{item[ikey]}</Link>
      </td>
    );
  } else if (ikey == "created_at" || ikey == "date") {
    const formatDate = fuFormatter(item[ikey]);
    return <td className="text-center">{formatDate}</td>;
  } else if (ikey == "log_type") {
    const colorHash = {
      create: "success",
      update: "info",
      duplicate: "danger",
    };
    const color = colorHash[item[ikey]];
    return (
      <td className="text-center">
        <Badge color={color}>{item[ikey]}</Badge>
      </td>
    );
  } else if (ikey == "status_text") {
    const colorHash = {
      "1": "success",
      "2": "info",
      "3": "warning",
      "5": "primary",
    };
    const color = colorHash[item["status"]];
    return (
      <td className="text-center">
        <Badge color={color}>{item[ikey]}</Badge>
      </td>
    );
  } else {
    return <td className="text-center">{item[ikey]}</td>;
  }
};

export default Item;
