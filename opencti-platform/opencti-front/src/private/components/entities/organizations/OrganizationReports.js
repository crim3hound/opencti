import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose, contains } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import inject18n from '../../../../components/i18n';
import OrganizationPopover from './OrganizationPopover';
import Reports from '../../reports/Reports';
import StixDomainEntityHeader from '../../common/stix_domain_entities/StixDomainEntityHeader';

const styles = (theme) => ({
  container: {
    transition: theme.transitions.create('padding', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  containerWithPadding: {
    flexGrow: 1,
    transition: theme.transitions.create('padding', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    paddingRight: 310,
  },
  paper: {
    height: '100%',
    minHeight: '100%',
    margin: '5px 0 0 0',
    padding: '25px 15px 15px 15px',
    borderRadius: 6,
  },
});

const organizationTypesForAuthorMode = ['vendor', 'csirt', 'partner'];

class OrganizationReportsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { withPadding: false };
  }

  render() {
    const { withPadding } = this.state;
    const { classes, organization } = this.props;
    if (
      contains(organization.organization_class, organizationTypesForAuthorMode)
    ) {
      return (
        <div
          className={
            withPadding ? classes.containerWithPadding : classes.container
          }
        >
          <StixDomainEntityHeader
            stixDomainEntity={organization}
            PopoverComponent={<OrganizationPopover />}
          />
          <Paper classes={{ root: classes.paper }} elevation={2}>
            <Reports
              authorId={organization.id}
              onChangeOpenExports={(openExports) => this.setState({ withPadding: openExports })
              }
            />
          </Paper>
        </div>
      );
    }
    return (
      <div
        className={
          withPadding ? classes.containerWithPadding : classes.container
        }
      >
        <StixDomainEntityHeader
          stixDomainEntity={organization}
          PopoverComponent={<OrganizationPopover />}
        />
        <Paper classes={{ root: classes.paper }} elevation={2}>
          <Reports
            objectId={organization.id}
            onChangeOpenExports={(openExports) => this.setState({ withPadding: openExports })
            }
          />
        </Paper>
      </div>
    );
  }
}

OrganizationReportsComponent.propTypes = {
  organization: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
};

const OrganizationReports = createFragmentContainer(
  OrganizationReportsComponent,
  {
    organization: graphql`
      fragment OrganizationReports_organization on Organization {
        id
        organization_class
        name
        alias
      }
    `,
  },
);

export default compose(inject18n, withStyles(styles))(OrganizationReports);
