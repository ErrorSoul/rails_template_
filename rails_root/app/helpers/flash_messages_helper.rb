module FlashMessagesHelper

  FLASH_TYPES = {
    success: 'alert-success',
    error:   'alert-danger',
    alert:   'alert-danger',
    warning: 'alert-warning',
    notice:  'alert-info'
  }.freeze

  def flash_messages(options = {})
    options[:static] ||= false

    options[:static] ? static_flash : dismissible_flash
  end

  private

  def flash_class(type)
    FLASH_TYPES[type.to_sym] || type
  end

  def static_flash
    safe_join(flash.map do |type, message|
      flash_class = ['alert', flash_class(type)].join(' ')

      content_tag :div, message, class: flash_class, role: 'alert'
    end)
  end

  def dismissible_flash
    safe_join(flash.map do |type, message|
      flash_class = ['alert', 'alert-dismissible', flash_class(type)].join(' ')

      button = content_tag :button, class: 'close', data: { dismiss: 'alert' } do
        content_tag :span, '&times;'.html_safe, aria: { hidden: 'true' }
      end

      content_tag :div, class: flash_class, role: 'alert' do
        safe_join([button, message])
      end
    end)
  end

end
