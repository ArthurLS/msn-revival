import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoffee, faAtom, faPhoneAlt, faPhoneSlash
} from '@fortawesome/free-solid-svg-icons';

/*
  FontAwesome library made cleaner
  Returns an atom symbol if the icon asked does not exists
*/
const lib = {
  atom: faAtom,
  coffee: faCoffee,
  hangUp: faPhoneSlash,
  call: faPhoneAlt
};

function FontAwesome({ icon, style }) {
  return lib[icon]
    ? <FontAwesomeIcon icon={lib[icon]} style={style} />
    : <FontAwesomeIcon icon={lib.atom} />;
}

export default FontAwesome;
