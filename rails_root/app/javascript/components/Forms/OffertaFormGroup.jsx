import React from "react";
import { FormGroup } from "reactstrap";


class OffertaFormGroup extends React.Component {
	 goToClick = (url) => {
		 this.props.history.push(url);
		 this.props.toggle();
	 }

	render() {
		return(
			<FormGroup>
        <div className="container h-100">
					<div className="row h-100 justify-content-center align-items-center">
						<div className="col-12 text-center">
							<p onClick={() => this.goToClick("/main/offerta")} className="p-condition-registration-new">
								{" "}
								<span>При входе или регистрации</span>{" "}
								<span>
									{" "}
									вы соглашаетесь с{" "}
									<span className="span-condition"> Условиями </span>{" "}
								</span>
							</p>
						</div>
					</div>
				</div>
      </FormGroup>
		);
	}
}

export default OffertaFormGroup;
