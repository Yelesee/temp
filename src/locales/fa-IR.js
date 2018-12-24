import analysis from './fa-IR/analysis';
import exception from './fa-IR/exception';
import form from './fa-IR/form';
import globalHeader from './fa-IR/globalHeader';
import login from './fa-IR/login';
import menu from './fa-IR/menu';
import monitor from './fa-IR/monitor';
import result from './fa-IR/result';
import settingDrawer from './fa-IR/settingDrawer';
import settings from './fa-IR/settings';
import pwa from './fa-IR/pwa';

export default {
  'navBar.lang': 'زبان ها',
  'layout.user.link.help': 'کمک',
  'layout.user.link.privacy': 'حریم خصوصی',
  'layout.user.link.terms': 'قوانین',
  'app.home.introduce': 'معرفی',
  'app.forms.basic.title': 'فورم اولیه',
  'app.forms.basic.description':
    'Form pages are used to collect or verify information to users, and basic forms are common in scenarios where there are fewer data items.',
  ...analysis,
  ...exception,
  ...form,
  ...globalHeader,
  ...login,
  ...menu,
  ...monitor,
  ...result,
  ...settingDrawer,
  ...settings,
  ...pwa,
};
