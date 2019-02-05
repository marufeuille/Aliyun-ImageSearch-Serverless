import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ImageDropper from "./imagedropper"
import RequestBuilder from "./requestbuilder"
import ResponseViewer from "./responseviewer"
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  stepper: {
    width: "100%"
  }
});

function getSteps() {
  return ['Select Image', 'Build other parameters', 'Response'];
}


class HorizontalLinearStepper extends React.Component {
  state = {
    activeStep: 0,
    skipped: new Set(),
    isFileSelected: false,
  };

  constructor(props) {
    super(props);
  }

  isStepOptional = step => {
    return step === 1;
  };

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return (<ImageDropper updateState={this.updateState.bind(this)}/>);
      case 1:
        return (<RequestBuilder onRef={ref => (this.child = ref)} updateState={this.responseArrival.bind(this)} handleBack={this.handleBack.bind(this)} base64img={this.state.base64img} file={this.state.base64img} />);
      case 2:
        return (<ResponseViewer onRef={ref => (this.ResponseViewer = ref)} handleBack={this.handleBack.bind(this)} handleReset={this.handleReset.bind(this)} response={this.state.response} base64img={this.state["converted_base64img"]} />);
      default:
        return 'Unknown step';
    }
  }

  handleNext = () => {
    const { activeStep } = this.state;
    let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped,
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    console.log("active steps: " + activeStep);
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  handleSkip = () => {
    const { activeStep } = this.state;
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values());
      skipped.add(activeStep);
      return {
        activeStep: state.activeStep + 1,
        skipped,
      };
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }

  updateState(state) {
    this.setState(state);
    //this.child.loadImage(this.state.base64img)
  }

  responseArrival = (state) => {
    this.setState(state);
    this.handleNext();
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <Grid container className={classes.root} spacing={16}>
        <CssBaseline />
        <Grid item xs={12}>
          <Grid container justify="center">
            <Grid item xs={10}>
              <Stepper className={classes.stepper} activeStep={activeStep}>
                {steps.map((label, index) => {
                  return (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={16}>
            <Grid item xs={10} id="contents">
              {this.getStepContent(activeStep)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

HorizontalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(HorizontalLinearStepper);

