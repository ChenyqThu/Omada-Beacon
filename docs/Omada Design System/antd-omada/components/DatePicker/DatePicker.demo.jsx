/* components/DatePicker/DatePicker.demo.jsx — window.OmadaDemos.DatePicker */
(function () {
  const { DatePicker, RangePicker, TimePicker } = window.Omada;
  const { Space } = window.antd;

  function DatePickerDemo() {
    const { lang, t } = window.useOmada();
    const today = window.dayjs ? window.dayjs() : undefined;
    return (
      <>
        <div className="row">
          <span className="label">date</span>
          <DatePicker placeholder={t('date.select.ph')} defaultValue={today} style={{ width: 200 }} />
          <DatePicker placeholder={t('date.select.ph')} disabled defaultValue={today} style={{ width: 200 }} />
        </div>
        <div className="row">
          <span className="label">picker</span>
          <DatePicker picker="week"  placeholder={t('date.select.ph')} style={{ width: 200 }} />
          <DatePicker picker="month" placeholder={t('date.select.ph')} style={{ width: 200 }} />
          <DatePicker picker="year"  placeholder={t('date.select.ph')} style={{ width: 200 }} />
        </div>
        <div className="row">
          <span className="label">range</span>
          <RangePicker
            placeholder={[t('date.start.ph'), t('date.end.ph')]}
            defaultValue={today ? [today.subtract(7, 'day'), today] : undefined}
            style={{ width: 320 }}
          />
        </div>
        <div className="row">
          <span className="label">date + time</span>
          <RangePicker showTime placeholder={[t('date.start.ph'), t('date.end.ph')]} style={{ width: 420 }} />
        </div>
        <div className="row">
          <span className="label">time</span>
          <Space size={10} wrap>
            <TimePicker placeholder={t('time.select.ph')} defaultValue={today} style={{ width: 160 }} />
            <TimePicker placeholder={t('time.select.ph')} use12Hours format="h:mm a" style={{ width: 160 }} />
            <TimePicker placeholder={t('time.select.ph')} disabled defaultValue={today} style={{ width: 160 }} />
          </Space>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.DatePicker = DatePickerDemo;
})();
