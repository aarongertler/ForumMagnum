import React from 'react';
import { Components, registerComponent } from '../../lib/vulcan-lib';
import Tags from '../../lib/collections/tags/collection';
import { Link } from '../../lib/reactRouterWrapper';

const styles = theme => ({
  root: {
    marginLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit/2,
    marginBottom: theme.spacing.unit/2
  },
})

const isLeftClick = (event) => {
  return event.button === 0 && !event.ctrlKey && !event.metaKey;
}

const TagsSearchHit = ({hit, clickAction, classes}: {hit: any, classes: any, clickAction?: any}) => <div className={classes.root}>
  <Link to={Tags.getUrl(hit)} onClick={(event) => isLeftClick(event) && clickAction()}>
    <Components.MetaInfo>
      {hit.name}
    </Components.MetaInfo>
  </Link>
</div>

const TagsSearchHitComponent = registerComponent("TagsSearchHit", TagsSearchHit, {styles});

declare global {
  interface ComponentTypes {
    TagsSearchHit: typeof TagsSearchHitComponent
  }
}

